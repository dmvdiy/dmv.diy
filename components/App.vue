<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, provide, nextTick, onUpdated } from 'vue'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import $ from 'jquery';
import { DateTime } from 'luxon';
import { useTheme } from '@/composables/useTheme';
import FullCalendar from '@fullcalendar/vue3'
import { ModalsContainer, useModal } from 'vue-final-modal'
import FilterModal from './FilterModal.vue'
import EventModal from './EventModal.vue'
import { clientCacheMaxAgeSeconds, clientStaleWhileInvalidateSeconds } from '~~/utils/util';
import { replaceBadgePlaceholders } from '~~/utils/util';
import { type CalendarOptions, type EventClickArg, type EventSourceInput } from '@fullcalendar/core/index.js';
import eventSourcesJSON from '@/assets/event_sources.json';
import { getAllTags } from '@/server/tagsListServe'; //Function that gives all tags utilized from event_sources.json

const clickedEvent: Ref<EventClickArg | null> = ref(null); // For storing the clickedEvent data
const calendarRef = ref(null); // Ref for the FullCalendar instance
const tags = ref(getAllTags()); // Ref for serving a full list of tags found in event_sources.json
provide('tags', tags); //Serves the tags array globally, allowing it to be accessed in FilterModal.vue

var beforeMOTDDate = (Date.now() < Date.parse('11/02/2024 2:30:00 PM'));//For hiding the MOTD, a better system will be implemented in the future!

const tagsToHide = ['hidden', 'internal', 'invisible']; // Tags that should hide events

const { theme } = useTheme();
watch(theme, () => {
  nextTick(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        moveListViewScrollbarToTodayAndColor();
      });
    });
  });
});
const pngLogo = ref('');

const getWindowHeight = () => {
  if (process.client) return window.innerHeight;
  return 600;
};

const getWindowWidth = () => {
  if (process.client) return window.innerWidth;
  return 350;
};

const calendarHeight = useCookie('calendarHeight', {
  sameSite: 'strict',
  default: () => 2000, maxAge: 60 * 60 * 24 * 365
});
if (process.client) calendarHeight.value = window.innerHeight;
const pageWidth = useCookie('pageWidth', {
  sameSite: 'strict',
  default: () => 1000, maxAge: 60 * 60 * 24 * 365
});
if (process.client) pageWidth.value = window.innerWidth;

const isUsingDayMaxEventRows = useState('isUsingDayMaxEventRows', () => true);

const updateWeekNumbers = () => {
  return getWindowWidth() < 350 ? false : true
};
// -1 indicates that there is no limit.
const updateDayMaxEventRows = () => { return isUsingDayMaxEventRows.value ? -1 : Math.floor(getWindowHeight() / 75) };

const calendarOptions = ref<CalendarOptions | undefined>()

const disabledEventSources = new Map<string, EventSourceInput>()

function enableEventSource(name: string) {
  if (!calendarOptions.value?.eventSources) return
  if (calendarOptions.value.eventSources.some(eventSource => name === eventSource.name)) return
  const source = disabledEventSources.get(name)
  if (source) calendarOptions.value.eventSources.push(source)
}

function disableEventSource(name: string) {
  if (!calendarOptions.value?.eventSources) return
  const newEventSources: EventSourceInput[] = []

  calendarOptions.value.eventSources.forEach(eventSource => {
    if (name === eventSource.name) {
      disabledEventSources.set(name, eventSource)
    } else {
      newEventSources.push(eventSource)
    }
  })

  calendarOptions.value.eventSources = newEventSources
}

function isDisplayingBasedOnTags(event) {
  let shouldHidefromHidden = false; // Whether the event should be hidden due to it having a tag with isHidden set to true
  let shouldShowfromHeader = false; // Whether the event contains a tag of a tagHeader whis isVisible, which is a pre-requisite to being visible
  let shouldShowfromTags = false; //Whether the event contains atleast one tag which is being searched for rn, has to be true.
  // Iterate over all tags of the event
  event.tags?.forEach(tagEvent => {
    tags.value.forEach(tagFilter => {
      if (tagFilter.isHidden && tagEvent === tagFilter.name) { shouldHidefromHidden = true; } // This tag dictates the event should be hidden
      if (tagFilter.isHeader && tagEvent === tagFilter.name && tagFilter.isVisible) { shouldShowfromHeader = true; } // This tag is a header and is required to show the event
      if (tagEvent === tagFilter.name && tagFilter.isVisible && !tagFilter.isHeader) { shouldShowfromTags = true; } // This tag allows the event to be shown
    });
  });

  // Determine the final display status based on the conditions evaluated
  return ((shouldShowfromHeader && shouldShowfromTags) && !shouldHidefromHidden) ? 'list-item' : 'none';
}

const updateDisplayingBasedOnTags = () => { //Function that re-renders the calendar by updating the display value of each event and resetting it altogether
  // Map over eventSources to create a new array with updated items
  const updatedEventSources = calendarOptions.value.eventSources.map(source => {
    const events = source.events?.map(event => ({
      ...event,
      display: isDisplayingBasedOnTags(event)
    })) || source.events;

    return { ...source, events };
  });

  // Replace the original eventSources with the new array to trigger reactivity
  calendarOptions.value.eventSources = updatedEventSources;
};

const { open: openFilterModal, close: closeFilterModal } = useModal({
  component: FilterModal,
  attrs: {
    enableEventSource,
    disableEventSource,
    onConfirm() {
      updateDisplayingBasedOnTags();
      moveListViewScrollbarToTodayAndColor();
      closeFilterModal();
    },
  },
})

const { open: openEventModal, close: closeEventModal } = useModal({
  component: EventModal,
  attrs: {
    event: clickedEvent,
    onConfirm() {
      closeEventModal()
    },
  },
})

calendarOptions.value = {
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  initialView: getWindowWidth() <= 600 ? 'listMonth' : 'dayGridMonth',
  customButtons: {
    less: {
      text: 'less',
      click: function () {
        isUsingDayMaxEventRows.value = !isUsingDayMaxEventRows.value;
        calendarOptions.value = {
          ...calendarOptions.value,
          dayMaxEventRows: updateDayMaxEventRows()
        };
      }
    },
    filter: {
      text: 'filter',
      click: openFilterModal,
    },
  },
  headerToolbar: {
    left: 'prev today filter',
    center: 'title',
    right: 'dayGridMonth,listMonth next'
  },
  buttonText: {
    month: 'grid', // Feels clearer than 'month' and 'list'
    list: 'list'
  },
  nowIndicator: true,
  height: '100vh',
  dayMaxEventRows: updateDayMaxEventRows(),
  navLinks: true,
  weekNumbers: updateWeekNumbers(),
  eventSources: [],

  eventClick: function (event) {
    event.jsEvent.preventDefault(); // Prevent the default behavior of clicking a link
    clickedEvent.value = event;
    openEventModal();
  },

  progressiveEventRendering: true, // More re-renders; not batched. Needs further testing.
  stickyHeaderDates: false,
  // Event handlers.
  // Move the scrollbar to today when the switching from other views.
  viewDidMount: moveListViewScrollbarToTodayAndColor,
  // eventDidMount: moveListViewScrollbarToTodayAndColor,

  eventContent: function(arg) {
    // Ensure you use v-html in your FullCalendar component to render HTML content
    // Format the start time and title as desired
    let startTime = '';
    if (arg.event.start) {
      // Use Luxon to format the time
      let startDateTime = DateTime.fromJSDate(arg.event.start);
      // Format the time to show "7p" for 19:00 and "5:30a" for 05:30
      startTime = startDateTime.toFormat('h:mma').toLowerCase(); // Converts to "7:00pm" or "5:30am"
      // Remove the leading "0" for times like "07:00pm", remove ":00" for whole hours, and remove "m" to return to it's previous format
      startTime = startTime.replace(/^0/, '').replace(':00', '').replace('m','');
    }
    let title = replaceBadgePlaceholders(arg.event.title);
    let contentHtml;
    if (arg.view.type != 'listMonth') {
      contentHtml = `<div class="fc-daygrid-event-dot" style="display: inline-block; vertical-align: middle; margin-right: 4px; position: relative; top: -1px;"></div><span class="fc-event-time" style="margin-right: 0px;">${startTime}</span> <span class="fc-event-title">${title}</span>`;
    }
    else {
      contentHtml = `<a href="${arg.event.url}" class="fc-event-link" style="text-decoration: none; color: inherit;"><span class="fc-event-title">${title}</span></a>`;
    }
    return { html: contentHtml };
  },
};

const updateCalendarHeight = () => {
  pageWidth.value = getWindowWidth();
  calendarHeight.value = getWindowHeight();
  calendarOptions.value = {
    ...calendarOptions.value,
    weekNumbers: getWindowWidth() < 350 ? false : true,
    dayMaxEventRows: updateDayMaxEventRows()
  };
};

function moveListViewScrollbarToTodayAndColor(retryCount = 5) {//Default retry count set to 5
  const listMonthViewScrollerClass = '.fc-scroller.fc-scroller-liquid';
  const dayGridMonthViewScrollerClass = '.fc-scroller.fc-scroller-liquid-absolute';

  const isInListMonthView = document.querySelector(listMonthViewScrollerClass) !== null;
  const isInDayGridMonthView = document.querySelector(dayGridMonthViewScrollerClass) !== null;

  const isInCurrentMonth = document.querySelector('.fc-list-day.fc-day.fc-day-today') !== null;

  if (isInListMonthView && isInCurrentMonth) {
    const today = document.querySelector('.fc-list-day.fc-day.fc-day-today');
    if (today.length <= 0) return;
    today?.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'nearest' });
    window.scrollTo(0, 0);
    // const todayY = today!.getBoundingClientRect().top;
    // const goToY = Math.min(todayY, todayY);
    // const listMonthViewScroller = document.querySelector(listMonthViewScrollerClass);
    // listMonthViewScroller!.scrollTop = goToY;

    // Old.
    // const today = '.fc-list-day.fc-day.fc-day-today';
    // const scrollLength = $('.fc-scroller.fc-scroller-liquid').prop("scrollHeight");
    // $('.fc-scroller.fc-scroller-liquid').scrollTop(Math.min($(today).position().top, scrollLength));
    nextTick(() => {
        // Fetch the value of --background-today from CSS
        const backgroundToday = getComputedStyle(document.documentElement).getPropertyValue('--background-today').trim();
        // Verify that backgroundToday is not the default or previous value
        if (backgroundToday && backgroundToday !== "#defaultOldValue") {
            // Code to apply the backgroundToday color
            const today = document.querySelector('.fc-day.fc-day-today');
            // Change today element's --fc-neutral-bg-color to backgroundToday.
            today?.style.setProperty('--fc-neutral-bg-color', backgroundToday);
        } else if (retryCount > 0) {
            // If the color hasn't updated, try again after another frame
            window.requestAnimationFrame(() => {
                moveListViewScrollbarToTodayAndColor(retryCount - 1);// Calls the function again until retrycount is 0 (which will then skip this portion)
            });
        }
    });

  }
  else if (isInDayGridMonthView) {
    const today = $('.fc-day.fc-day-today.fc-daygrid-day');
    if (today.length <= 0) return;
    const scrollLength = $('.fc-scroller.fc-scroller-liquid-absolute').prop("scrollHeight");
    $(dayGridMonthViewScrollerClass).scrollTop(Math.min($(today).position().top, scrollLength));
  }
}

async function getEventSources() {
  const endpoints = eventSourcesJSON.appConfig.eventApiToGrab;
  const clientHeaders = {
    'Cache-Control': `max-age=${clientCacheMaxAgeSeconds}, stale-while-revalidate=${clientStaleWhileInvalidateSeconds}`,
  };
  // This is to preventing the UI changes from each fetch result to cause more fetches to occur.,
  Promise.allSettled(endpoints.map(async (endpoint) => {
    const { data } = await useLazyFetch(endpoint, { headers: clientHeaders });
    return addEventSources(transformEventSourcesResponse(data));
  }));
}

// Multiple re-renders (which may be unrelated to the fetching) cause this to be called multiple times.
getEventSources();
// A hack to move the scrollbar to today after mounting- it is inconsistent otherwise on mobile.
if (process.client)
  setTimeout(moveListViewScrollbarToTodayAndColor, 0);

onMounted(() => {
  window.addEventListener("resize", updateCalendarHeight);
  moveListViewScrollbarToTodayAndColor();
  // Expose the calendar instance to the window object for debugging
  if (calendarRef.value) window.myCalendar = calendarRef.value.getApi();
  // for the logo
  async function fetchLogo() {
    pngLogo.value = '/css/dmvdiylogo.png'
  }
  fetchLogo();
});
onUpdated(() => {
});

onUnmounted(() => {
  if (process.client) window.removeEventListener('resize', updateWeekNumbers)
});

// Updates calendarOptions' eventSources and triggers a re-render of the calendar.
function addEventSources(newEventSources: EventNormalSource[] | EventGoogleCalendarSource[]) {
  // Cut out events without times, but typecheck for types that can have invalid times.
  newEventSources = newEventSources.map(eventSource => {
    // Skip events that can't be invalid.
    if (eventSource.events === undefined) return eventSource;

    // Filter events.
    const updatedEvents = new Array();
    eventSource.events.forEach((event) => {
      /* REMOVED TEMPORARILY, replaced with the hack below: Remove events that last longer than 3 days.
      Note: This also tends to cut out Eventbrite events that have 'Multiple Dates' over a range of 3 days.
      Using the official Eventbrite API would allow us to avoid this issue, but would potentially run into
      rate limits pretty quickly during peak hours. */
      const lengthInDays = Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 3600 * 24));

      if (lengthInDays <= eventDayDurationSplitThreshold) {
        updatedEvents.push(event);
      }
      else {
        // Split the event into multiple day-long events.
        // for (let i = 0; i < lengthInDays; i++) {
          // Temporarily just split into the first day and last day. TODO: Change this to split into individual days.
        for (let i = 0; i < lengthInDays; i += lengthInDays - 1) {

          let currentDayStart = DateTime.fromJSDate(event.start, { zone: 'utc' });
          // Set currentDayEnd to start's day, but end's hour and minute.
          let currentDayEnd = DateTime.fromJSDate(event.end, { zone: 'utc' }).set({ month: currentDayStart.month, day: currentDayStart.day }).plus({ days: i });
          currentDayStart = currentDayStart.plus({ days: i });

          // // Adjust for end time being before start time.
          if (currentDayEnd < currentDayStart) {
            currentDayEnd.plus({ days: 1 });
          }

          // If set to all-day, set start to 0 and end to 23:59 in America/Los_Angeles time, to correct inaccurate times.
          if (event.allDay) {
            currentDayStart = currentDayStart.setZone('America/Los_Angeles').set({ hour: 0, minute: 0 }).toUTC();
            currentDayEnd = currentDayEnd.setZone('America/Los_Angeles').set({ hour: 23, minute: 59 }).toUTC();
          }

          const newSplitEvent = {
            ...event,
            // allDay: false,
            // title: `${event.title} (Day (${i + 1}/${lengthInDays})`,
            title: `${event.title} (${i === lengthInDays ? 'Last' : 'First'} Day)`,
            start: currentDayStart.toJSDate(),
            // Use the end time's hour and minute.
            end: currentDayStart.toJSDate(),
          };
          updatedEvents.push(newSplitEvent);
        }
      }
    });

    return {
      ...eventSource,
      events: updatedEvents,
      // events: newEvents,
    } as EventNormalSource;
  });
  // Issue: might take a long time to actually update the calendar if the list of, for example, Eventbrite events/sources is large.

  calendarOptions.value = {
    ...calendarOptions.value,
    eventSources: calendarOptions.value?.eventSources?.concat(newEventSources)
  };

  return calendarOptions.value
}

const transformEventSourcesResponse = (eventSources: Ref<Record<string, any>>) => {
  const eventsSourcesWithoutProxy = toRaw(eventSources.value.body)
  if (!eventsSourcesWithoutProxy || eventsSourcesWithoutProxy.length < 1) return [];
  const datesAdded = eventsSourcesWithoutProxy.map(eventSource => {
    return {
      ...eventSource,
      // Set the `display` property, since the endpoints don't add it.
      events: eventSource.events.map(event => {
        return {
          ...event,
          // Convert date strings to Date objects.
          start: new Date(event.start),
          end: new Date(event.end),
          display: isDisplayingBasedOnTags(event)
        }
      })
    }
  })
  return datesAdded;
}

</script>

<template>
  <ModalsContainer />
  <div class="calendar-container">
    <LogoHeader />
    <div style="text-align: center;" v-if="beforeMOTDDate">
    </div>
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
    <div style="display: flex; align-items: center; flex-direction: row;">
      <div class="desc" style="padding-bottom: 0;">
        <p>
          This site is meant to be a free hub for community events and resources in the DMV area and is
          currently a work in progress. If you have an event you would like to include, or feedback on this
          site, submit via our form OR reach out to us at
          <a href="mailto:dmv.diy.fyi@gmail.com">dmv.diy.fyi@gmail.com</a>
        </p>
        <p>
          At this moment we would like to focus on local DIY shows and events that provide a safe space for queer community. For best results please include as much of the following information as possible: Event title, date, location, time, entry fee or a flyer/link to the event.
        </p>
        <p>
          The source code for this site was 'forked' from <a href="https://rva.rip">rva.rip</a> and its sister sites
          <a href="https://anarchism.nyc">anarchism.nyc</a>, <a href="https://anarchism.boston">anarchism.boston</a>, and <a href="https://bay.lgbt">bay.lgbt</a>.
        </p>
        <p>
          Before making plans, consider checking with venue staff or event organizers directly. This site is not
          affiliated with any events listed.
        </p>
        <p>
          Links to other resources
          <ul style="line-height: 1.5em">
            <li><a href="https://www.rhizomedc.org/updates">Rhizome volunteer sign-ups</a></li>
            <li><a href="https://www.tumblr.com/baltshowplace">Baltimore Show and Booking Resource (BaltShowPlace)</a></li>
            <li><a href="https://dmvmutualaid.carrd.co/">DMV Mutual Aid</a></li>
            <li><a href="https://dcurbangardenernetwork.wordpress.com/">DC Urban Gardener (DUG) Network</a></li>
            <li><a href="https://dctoollibrary.org/category/events/">DC Tool Library</a></li>
            <li><a href="https://drive.google.com/drive/u/0/folders/1FZudPOQZAnYH1iQXNBkqF57GR0lcQMro?fbclid=PAAaZeYBkvvm9htFplB2hIY7O0lBfbDBuNxkc4tnSO_f1c7nRFHUQfHP82suc_aem_AfVwq4j54yxAD6L4h_Mo5bWsFtZ2xicf8eNQ9DZkxGgP7kmsUh0bnT8oufZX2gqjw08">Free Resource Library on Palestine</a></li>
            <li><a href="https://linktr.ee/dctransevents?fbclid=PAZXh0bgNhZW0CMTEAAaZXuVuariZKJa-utN5USQXT7HlfWG9P8IIA-YFtfpS6zhITp1WQYvt91Z8_aem_6tzkEwc9-q9SjyR3guLP-g">DC Trans Events (they have their own calendar!)</a></li>
          </ul>
        </p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<style>
* {
  cursor: url(/public/css/peo99.cur), auto !important; 
}
</style>
