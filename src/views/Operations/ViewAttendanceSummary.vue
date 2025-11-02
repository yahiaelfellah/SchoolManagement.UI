<template>
  <div class="operations-container">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card>
      <a-table
        :data-source="summaryData"
        :columns="columns"
        row-key="id"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'

const { tl } = useLocalI18n('operations.viewAttendanceSummary')

const summaryData = ref([
  { id: 1, student: 'Ali Ahmed', totalDays: 20, present: 18, absent: 2 },
  { id: 2, student: 'Sara Mohamed', totalDays: 20, present: 19, absent: 1 }
])

const columns = [
  { title: tl('table.student'), dataIndex: 'student' },
  { title: tl('table.totalDays'), dataIndex: 'totalDays' },
  { title: tl('table.present'), dataIndex: 'present' },
  { title: tl('table.absent'), dataIndex: 'absent' }
]
</script>

<style scoped>
.operations-container {
  max-width: 60vw;
  margin: auto;
  padding: 20px;
}
</style>
