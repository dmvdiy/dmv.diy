function escapeXml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripHtml(str: string): string {
  return (str || '').replace(/<[^>]*>/g, '');
}

export default defineEventHandler(async (event) => {
  const origin = getRequestURL(event).origin;
  const data = await $fetch(`${origin}/api/events/googleCalendar`);

  const allEvents = (data as any).body
    ?.flatMap((source: any) => source.events || []) || [];

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const items = allEvents
    .filter((e: any) => e.start && new Date(e.start) >= cutoff)
    .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 1000)
    .map((e: any) => {
      const start = new Date(e.start);
      const dateStr = start.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York'
      });
      const description = [dateStr, e.location, '', stripHtml(e.description)].filter(Boolean).join('\n').trim();
      return `
  <item>
    <title>${escapeXml(e.title)}</title>
    <link>${escapeXml(e.url)}</link>
    <guid isPermaLink="false">${escapeXml(e.id)}</guid>
    <pubDate>${start.toUTCString()}</pubDate>
    <description><![CDATA[${description}]]></description>
    ${e.location ? `<category>${escapeXml(e.location)}</category>` : ''}
  </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DMV DIY Community Calendar</title>
    <link>${origin}</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Community events in the DC Metro Area</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  setHeader(event, 'content-type', 'application/rss+xml; charset=UTF-8');
  return xml;
});
