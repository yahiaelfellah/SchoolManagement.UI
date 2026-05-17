<template>
  <a-table
    :columns="columns"
    :data-source="weekData"
    bordered
    size="small"
  />
</template>

<script setup lang="ts">
import moment from 'moment';

const props = defineProps<{ events: any[] }>()
const startOfWeek = moment().startOf('week')
const columns = Array.from({ length: 7 }, (_, i) => ({
  title: startOfWeek.add(i, 'day').format('ddd, MMM D'),
  dataIndex: i.toString(),
}))

const weekData = [
  Object.fromEntries(
    columns.map((col, i) => {
      const date = startOfWeek.add(i, 'day').format('YYYY-MM-DD')
      const events = props.events.filter(e =>
        moment(date).isBetween(e.dateRange[0], e.dateRange[1], 'day', '[]')
      )
      return [i, events.map(e => e.title).join(', ') || '-']
    })
  ),
]
</script>
