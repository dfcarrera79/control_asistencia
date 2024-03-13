<script>
import {
  QCalendarMonth,
  daysBetween,
  isOverlappingDates,
  parsed,
  today,
  indexOf,
} from '@quasar/quasar-ui-qcalendar/src/index.js';
import { defineComponent } from 'vue';
import NavigationBar from '../../components/NavigationBar.vue';
import JornadasComponent from './JornadasComponent.vue';
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';

export default defineComponent({
  name: 'MonthSlotWeek',
  components: {
    NavigationBar,
    JornadasComponent,
    QCalendarMonth,
  },
  emits: ['fecha', 'array'],
  props: {
    events: Array, // Define events as a prop
  },
  data() {
    return {
      locale: 'es',
      show: false,
      selectedDate: today(),
      horario: [],
    };
  },
  methods: {
    emitFecha(selectedDate) {
      this.$emit('fecha', selectedDate);
    },
    emitArray(arrayHorario) {
      this.$emit('array', arrayHorario);
    },
    getWeekEvents(week) {
      const firstDay = parsed(week[0].date + ' 00:00');
      const lastDay = parsed(week[week.length - 1].date + ' 23:59');

      const eventsWeek = [];
      this.events.forEach((event, id) => {
        const startDate = parsed(event.start + ' 00:00');
        const endDate = parsed(event.end + ' 23:59');

        if (isOverlappingDates(startDate, endDate, firstDay, lastDay)) {
          const left = daysBetween(firstDay, startDate, true);
          const right = daysBetween(endDate, lastDay, true);

          eventsWeek.push({
            id, // index event
            left, // Position initial day [0-6]
            right, // Number days available
            size: week.length - (left + right), // Size current event (in days)
            event, // Info
          });
        }
      });

      const events = [];
      if (eventsWeek.length > 0) {
        const infoWeek = eventsWeek.sort((a, b) => a.left - b.left);
        infoWeek.forEach((_, i) => {
          this.insertEvent(events, week.length, infoWeek, i, 0, 0);
        });
      }

      return events;
    },

    monthFormatter() {
      try {
        return new Intl.DateTimeFormat(this.locale || undefined, {
          month: 'long',
          timeZone: 'UTC',
        });
      } catch (e) {
        // Handle any potential error (optional)
        console.error('Error creating Intl.DateTimeFormat:', e);
        return null; // or provide a default formatter
      }
    },

    insertEvent(events, weekLength, infoWeek, index, availableDays, level) {
      const iEvent = infoWeek[index];
      if (iEvent !== undefined && iEvent.left >= availableDays) {
        // If you have space available, more events are placed
        if (iEvent.left - availableDays) {
          // It is filled with empty events
          events.push({ size: iEvent.left - availableDays });
        }
        // The event is built
        events.push({ size: iEvent.size, event: iEvent.event });

        if (level !== 0) {
          // If it goes into recursion, then the item is deleted
          infoWeek.splice(index, 1);
        }

        const currentAvailableDays = iEvent.left + iEvent.size;

        if (currentAvailableDays < weekLength) {
          const indexNextEvent = indexOf(
            infoWeek,
            (e) => e.id !== iEvent.id && e.left >= currentAvailableDays
          );

          this.insertEvent(
            events,
            weekLength,
            infoWeek,
            indexNextEvent !== -1 ? indexNextEvent : index,
            currentAvailableDays,
            level + 1
          );
        } // else: There are no more days available, end of iteration
      } else {
        events.push({ size: weekLength - availableDays });
        // end of iteration
      }
    },

    badgeClasses(computedEvent) {
      if (computedEvent.event !== undefined) {
        return {
          'my-event': true,
          'text-white': true,
          [`bg-${computedEvent.event.bgcolor}`]: true,
          'rounded-border': true,
          'q-calendar__ellipsis': true,
        };
      }
      return {
        'my-void-event': true,
      };
    },

    badgeStyles(computedEvent, weekLength) {
      const s = {};
      if (computedEvent.size !== undefined) {
        s.width = (100 / weekLength) * computedEvent.size + '%';
      }
      return s;
    },

    isBetweenDatesWeek(dateStart, dateEnd, weekStart, weekEnd) {
      return (
        (dateEnd < weekEnd && dateEnd >= weekStart) ||
        dateEnd === weekEnd ||
        (dateEnd > weekEnd && dateStart <= weekEnd)
      );
    },

    update(data) {
      console.log('[UPDATE]: ', JSON.stringify(data));
      this.show = false;
    },

    remove(data) {
      const clickedDate = data.horario[0].end;
      const filteredEvents = this.events.filter(
        (event) => event.end !== clickedDate
      );
      this.emitArray(filteredEvents);
      this.show = false;
    },

    onToday() {
      this.$refs.calendar.moveToToday();
    },
    onPrev() {
      this.$refs.calendar.prev();
    },
    onNext() {
      this.$refs.calendar.next();
    },
    onMoved(data) {
      console.log('onMoved', data);
    },
    onChange(data) {
      console.log('onChange', data);
    },
    onClickDate(data) {
      console.log('onClickDate', data);
    },
    onClickDay(data) {
      const clickedDate = data.scope.timestamp.date;

      const filteredEvents = this.events.filter(
        (event) => event.end == clickedDate
      );

      this.horario = filteredEvents;

      if (this.horario.length !== 0) {
        this.show = true;
      }
    },
    onClickWorkweek(data) {
      console.log('onClickWorkweek', data);
    },
    onClickHeadDay(data) {
      console.log('onClickHeadDay', data);
    },
    onClickHeadWorkweek(data) {
      console.log('onClickHeadWorkweek', data);
    },
  },
  computed: {
    formattedMonth() {
      const date = new Date(this.selectedDate);
      return this.monthFormatter().format(date) + ' ' + date.getFullYear();
    },
  },
  watch: {
    selectedDate(newSelectedDate) {
      this.emitFecha(newSelectedDate);
    },
  },
});
</script>

<template>
  <q-dialog v-model="show">
    <jornadas-component
      :horario="horario"
      @actualizar="update"
      @eliminar="remove"
    />
  </q-dialog>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        font-family: 'Bebas Neue';
      "
    >
      <div style="font-size: 2em">{{ formattedMonth }}</div>
    </div>

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          :locale="locale"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          animated
          bordered
          focusable
          hoverable
          no-active-date
          :day-min-height="60"
          :day-height="0"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        >
          <template #week="{ scope: { week, weekdays } }">
            <template
              v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
              :key="index"
            >
              <div
                :class="badgeClasses(computedEvent)"
                :style="badgeStyles(computedEvent, week.length)"
              >
                <div
                  v-if="computedEvent.event && computedEvent.event.details"
                  class="title q-calendar__ellipsis"
                >
                  {{
                    computedEvent.event.title +
                    (computedEvent.event.time
                      ? ' - ' + computedEvent.event.time
                      : '')
                  }}
                  <q-tooltip>{{ computedEvent.event.details }}</q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.my-event
  position: relative
  display: inline-flex
  white-space: nowrap
  font-size: 12px
  height: 16px
  max-height: 16px
  margin: 1px 0 0 0
  justify-content: center
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.my-void-event
  display: inline-flex
  white-space: nowrap
  height: 1px

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.rounded-border
  border-radius: 2px
</style>
