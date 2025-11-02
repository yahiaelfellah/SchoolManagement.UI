<template>
  <a-calendar :fullscreen="false">
    <template #dateCellRender="{ current }">
      <ul class="events">
        <li
          v-for="ev in eventsForDate(current.format('YYYY-MM-DD'))"
          :key="ev.id"
        >
          <a-tag color="blue">
            {{ ev.title }}
          </a-tag>
        </li>
      </ul>
    </template>
  </a-calendar>
</template>

<script setup lang="ts">
import moment from 'moment';
const props = defineProps<{ events: any[] }>()

const eventsForDate = (date: string) =>
  props.events.filter(e =>
    moment(date).isBetween(e.dateRange[0], e.dateRange[1], 'day', '[]')
  )
</script>

<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
