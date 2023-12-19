<template>
  <div class="subcontent">
    <navigation-bar @today="onToday" @prev="onPrev" @next="onNext" />

    <div class="row justify-center">
      <div style="display: flex; max-width: 800px; width: 100%">
        <q-calendar-month
          locale="es"
          ref="calendar"
          v-model="selectedDate"
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
          <template #day="{ scope: { timestamp } }">
            <template
              v-for="event in eventsMap[timestamp.date]"
              :key="event.id"
            >
              <div
                :class="badgeClasses(event, 'day')"
                :style="badgeStyles(event, 'day')"
                class="my-event"
              >
                <div class="title q-calendar__ellipsis">
                  {{ event.title + (event.time ? ' - ' + event.time : '') }}
                  <q-tooltip>{{ event.details }}</q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  QCalendarMonth,
  addToDate,
  parseDate,
  parseTimestamp,
  today,
} from '@quasar/quasar-ui-qcalendar/src/index.js';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass';

import { ref } from 'vue';
import NavigationBar from '../../components/NavigationBar.vue';

// The function below is used to set up our demo data
const CURRENT_DAY = new Date();
function getCurrentDay(day) {
  const newDay = new Date(CURRENT_DAY);
  newDay.setDate(day);
  const tm = parseDate(newDay);
  return tm.date;
}

const selectedDate = ref(today());
const events = ref([
  {
    id: 1,
    title: '1st of the Month',
    details: 'Horario Bodega Grupo 1',
    date: getCurrentDay(1),
    bgcolor: 'primary',
  },
  {
    id: 2,
    title: '2nd of the Month',
    details: 'Horario Bodega Grupo 1',
    date: getCurrentDay(2),
    bgcolor: 'green',
  },
]);

const eventsMap = ref({});
if (events.value.length > 0) {
  events.value.forEach((event) => {
    (eventsMap.value[event.date] = eventsMap.value[event.date] || []).push(
      event
    );
    if (event.days !== undefined) {
      let timestamp = parseTimestamp(event.date);
      let days = event.days;
      do {
        timestamp = addToDate(timestamp, { day: 1 });
        if (!eventsMap.value[timestamp.date]) {
          eventsMap.value[timestamp.date] = [];
        }
        eventsMap.value[timestamp.date].push(event);
      } while (--days > 1);
    }
  });
}

const badgeClasses = (event, type) => {
  return {
    [`text-white bg-${event.bgcolor}`]: true,
    'rounded-border': true,
  };
};

const badgeStyles = (day, event) => {
  const s = {};
  return s;
};

const onToday = () => {
  this.$refs.calendar.moveToToday();
};

const onPrev = () => {
  this.$refs.calendar.prev();
};

const onNext = () => {
  this.$refs.calendar.next();
};

const onMoved = (data) => {
  console.log('onMoved', data);
};

const onChange = (data) => {
  console.log('onChange', data);
};

const onClickDate = (data) => {
  console.log('onClickDate', data);
};

const onClickDay = (data) => {
  console.log('onClickDay', data);
};

const onClickWorkweek = (data) => {
  console.log('onClickWorkweek', data);
};

const onClickHeadDay = (data) => {
  console.log('onClickHeadDay', data);
};

const onClickHeadWorkweek = (data) => {
  console.log('onClickHeadWorkweek', data);
};
</script>

<style lang="sass" scoped>
.my-event
  position: relative
  font-size: 12px
  width: 100%
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
