<template>
  <div>
    <a-date-picker v-model:value="currentDate" />
    <a-list
      :data-source="eventsForDay"
      bordered
      style="margin-top: 16px;"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta
            :title="item.title"
            :description="item.type"
          />
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed, ref } from 'vue';
const props = defineProps<{ events: any[] }>()
const currentDate = ref(moment())
const eventsForDay = computed(() =>
    props.events.filter(e =>
        moment(currentDate.value).isBetween(e.dateRange[0], e.dateRange[1], 'day', '[]')
    )
)
</script>
