<template>
  <div class="audit-log-page">
    <a-page-header
      title="Audit Log"
      sub-title="View all financial operations and changes"
      @back="() => $router.push({ name: 'Finance' })"
    />

    <a-card>
      <template #extra>
        <a-space>
          <a-select
            v-model:value="filters.action"
            placeholder="Filter by action"
            allow-clear
            style="width: 200px"
            @change="handleFilter"
          >
            <a-select-option value="Payment">Payment</a-select-option>
            <a-select-option value="Invoice">Invoice</a-select-option>
            <a-select-option value="Tuition Plan">Tuition Plan</a-select-option>
            <a-select-option value="Service">Service</a-select-option>
          </a-select>

          <a-select
            v-model:value="filters.entityType"
            placeholder="Filter by entity"
            allow-clear
            style="width: 150px"
            @change="handleFilter"
          >
            <a-select-option value="payment">Payment</a-select-option>
            <a-select-option value="invoice">Invoice</a-select-option>
            <a-select-option value="tuitionPlan">Tuition Plan</a-select-option>
            <a-select-option value="service">Service</a-select-option>
          </a-select>

          <a-range-picker
            v-model:value="dateRange"
            format="YYYY-MM-DD"
            @change="handleDateRangeChange"
          />
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data-source="filteredLogs"
        :loading="loading"
        row-key="id"
        :pagination="{ pageSize: 20 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'timestamp'">
            {{ formatDateTime(record.timestamp) }}
          </template>
          <template v-else-if="column.key === 'entityType'">
            <a-tag v-if="record.entityType">{{ record.entityType }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/financeStore'
import dayjs, { type Dayjs } from 'dayjs'
import type { AuditLog } from '@/model/auditLog'

const router = useRouter()
const financeStore = useFinanceStore()
const { auditLogs, loading } = financeStore

const filters = ref({
  action: undefined as string | undefined,
  entityType: undefined as string | undefined,
  startDate: undefined as string | undefined,
  endDate: undefined as string | undefined
})

const dateRange = ref<[Dayjs | null, Dayjs | null]>([null, null])

const filteredLogs = computed(() => {
  let logs = [...auditLogs.value]
  
  if (filters.value.action) {
    logs = logs.filter(log => log.action.includes(filters.value.action!))
  }
  
  if (filters.value.entityType) {
    logs = logs.filter(log => log.entityType === filters.value.entityType)
  }
  
  if (filters.value.startDate) {
    logs = logs.filter(log => dayjs(log.timestamp).isAfter(dayjs(filters.value.startDate)))
  }
  
  if (filters.value.endDate) {
    logs = logs.filter(log => dayjs(log.timestamp).isBefore(dayjs(filters.value.endDate)))
  }
  
  return logs
})

const columns = [
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'Performed By', dataIndex: 'performedBy', key: 'performedBy' },
  { title: 'Timestamp', key: 'timestamp' },
  { title: 'Entity Type', key: 'entityType' },
  { title: 'Details', dataIndex: 'details', key: 'details' }
]

const formatDateTime = (timestamp: string) => {
  return dayjs(timestamp).format('DD MMM YYYY HH:mm:ss')
}

const handleFilter = async () => {
  await financeStore.fetchAuditLogs(filters.value)
}

const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
  if (dates && dates[0] && dates[1]) {
    filters.value.startDate = dates[0].format('YYYY-MM-DD')
    filters.value.endDate = dates[1].format('YYYY-MM-DD')
  } else {
    filters.value.startDate = undefined
    filters.value.endDate = undefined
  }
  handleFilter()
}

onMounted(() => {
  financeStore.fetchAuditLogs()
})
</script>

<style scoped>
.audit-log-page {
  padding: 20px;
}
</style>

