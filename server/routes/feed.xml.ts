import { serverCacheMaxAgeSeconds, serverStaleWhileInvalidateSeconds } from '@/utils/util';

export default defineCachedEventHandler(async (event) => {
  const startTime = new Date();
  const allEvents: any[] = [];

  try {
    // Always fetch fresh from Google Calendar API
    try {
      const requestURL = getRequestURL(event);
      // Fix for localhost - use host instead of origin to include port
      let baseURL = `${requestURL.protocol}//${requestURL.host}`;

      // Fallback for development - check if we're missing a port
      if (!baseURL.match(/:\d+$/) && (baseURL.includes('localhost') || baseURL.includes('127.0.0.1'))) {
        baseURL = 'http://localhost:3000';
      }

      console.log('RSS: Fetching from Google Calendar API at:', baseURL);
      const response = await $fetch('/api/events/googleCalendar', {
        baseURL: baseURL
      });
      console.log('RSS: Response received:', response ? 'yes' : 'no');
      const responseData = response as any;
      const sources = responseData?.body;
      console.log('RSS: Sources found:', Array.isArray(sources) ? sources.length : 'none');

      if (Array.isArray(sources)) {
        sources.forEach((source: any) => {
          if (source?.events && Array.isArray(source.events)) {
            console.log(`RSS: Adding ${source.events.length} events from ${source.name}`);
            allEvents.push(...source.events);
          }
        });
      }
    } catch (error) {
      console.error('RSS: Error fetching Google Calendar events:', error);
    }

    console.log(`RSS: Total events collected: ${allEvents.length}`);

    // Filter for upcoming events only (past 7 days to next 90 days to catch recently passed events)
    const now = new Date();
    const pastLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const futureLimit = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days ahead

    const upcomingEvents = allEvents
      .filter(e => {
        if (!e.start) return false;
        const eventDate = new Date(e.start);
        return eventDate >= pastLimit && eventDate <= futureLimit;
      })
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 1000); // Limit to 1000 most recent events

    // Generate RSS feed
    const rssXml = generateRSSFeed(upcomingEvents, event);

    // Set proper content type for RSS
    setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8');

    return rssXml;
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    setResponseStatus(event, 500);
    return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title></channel></rss>';
  }
}, {
  maxAge: 60 * 60, // 1 hour in seconds
  swr: true,
});

function generateRSSFeed(events: any[], event: any): string {
  const baseUrl = getRequestURL(event).origin;
  const buildDate = new Date().toUTCString();

  // Escape XML special characters
  const escapeXml = (unsafe: string): string => {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Strip HTML tags for description
  const stripHtml = (html: string): string => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const items = events.map(event => {
    const title = escapeXml(event.title || 'Untitled Event');
    const link = escapeXml(event.url || baseUrl);
    const pubDate = new Date(event.start).toUTCString();

    const location = event.location || '';
    const description = stripHtml(event.description || '');

    // Format event details as simple text
    let itemDescription = '';
    if (event.start) {
      const eventDate = new Date(event.start);
      const eventEnd = event.end ? new Date(event.end) : null;
      itemDescription += `${eventDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })}`;
      if (eventEnd) {
        itemDescription += ` - ${eventEnd.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        })}`;
      }
    }
    if (location) {
      itemDescription += `. ${location}`;
    }
    if (description) {
      itemDescription += `. ${description}`;
    }

    return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <description>${itemDescription}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${escapeXml(event.id || String(event.start) + title)}</guid>
    </item>`;
  }).join('\\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>dmv.diy - DMV Community Events</title>
    <link>${baseUrl}</link>
    <description>A free hub for community events and resources in the DMV area</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}
