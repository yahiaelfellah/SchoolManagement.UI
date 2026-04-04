<template>
  <div class="payment-ledger-page">
    <a-page-header
      :title="tl('paymentLedger.title')"
      :sub-title="tl('paymentLedger.description')"
      @back="() => $router.push({ name: 'Finance' })"
    />

    <a-card>
      <template #extra>
        <a-space>
          <a-select
            v-model:value="selectedStudent"
            :placeholder="tl('paymentLedger.filterByStudent')"
            allow-clear
            style="width: 200px"
            @change="handleFilter"
          >
            <a-select-option :value="1">
              Student 1
            </a-select-option>
            <a-select-option :value="2">
              Student 2
            </a-select-option>
            <a-select-option :value="3">
              Student 3
            </a-select-option>
          </a-select>

          <a-select
            v-model:value="selectedStatus"
            :placeholder="tl('paymentLedger.filterByStatus')"
            allow-clear
            style="width: 150px"
            @change="handleFilter"
          >
            <a-select-option value="paid">
              Paid
            </a-select-option>
            <a-select-option value="partial">
              Partial
            </a-select-option>
            <a-select-option value="overdue">
              Overdue
            </a-select-option>
          </a-select>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data-source="filteredLedgers"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'studentId'">
            Student {{ record.studentId }}
          </template>
          <template v-else-if="column.key === 'month'">
            {{ formatMonth(record.month) }}
          </template>
          <template v-else-if="column.key === 'amountDue'">
            {{ record.amountDue.toLocaleString() }} TND
          </template>
          <template v-else-if="column.key === 'amountPaid'">
            {{ record.amountPaid.toLocaleString() }} TND
          </template>
          <template v-else-if="column.key === 'balance'">
            <span :class="{ 'text-red': record.balance > 0 }">
              {{ record.balance.toLocaleString() }} TND
            </span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status.toUpperCase() }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'dueDate'">
            {{ formatDate(record.dueDate) }}
          </template>
          <template v-else-if="column.key === 'services'">
            <a-tag
              v-for="(amount, serviceId) in record.servicesBreakdown"
              :key="serviceId"
            >
              Service {{ serviceId }}: {{ amount }} TND
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import type { PaymentLedger } from '@/model/paymentLedger'
import dayjs from 'dayjs'

const financeStore = useFinanceStore()
const { tl, t } = useLocalI18n('operations.finance')
const paymentLedgers = computed<PaymentLedger[]>(() => financeStore.paymentLedgers)
const loading = computed(() => financeStore.loading)
const selectedStudent = ref<number | undefined>(undefined)
const selectedStatus = ref<string | undefined>(undefined)

const filteredLedgers = computed(() => {
  let filtered = [...paymentLedgers.value]
  
  if (selectedStudent.value) {
    filtered = filtered.filter(l => l.studentId === selectedStudent.value)
  }
  
  if (selectedStatus.value) {
    filtered = filtered.filter(l => l.status === selectedStatus.value)
  }
  
  return filtered
})

const columns = [
  { title: tl('paymentLedger.student'), key: 'studentId' },
  { title: tl('paymentLedger.month'), key: 'month' },
  { title: tl('paymentLedger.amountDue'), key: 'amountDue' },
  { title: tl('paymentLedger.amountPaid'), key: 'amountPaid' },
  { title: tl('paymentLedger.balance'), key: 'balance' },
  { title: tl('paymentLedger.status'), key: 'status' },
  { title: tl('paymentLedger.dueDate'), key: 'dueDate' },
  { title: tl('paymentLedger.services'), key: 'services' }
]

const formatMonth = (month: string) => {
  return dayjs(`${month}-01`).format('MMMM YYYY')
}

const formatDate = (date: string) => {
  return dayjs(date).format('DD MMM YYYY')
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'green'
    case 'partial':
      return 'orange'
    case 'overdue':
      return 'red'
    default:
      return 'default'
  }
}

const handleFilter = () => {
  // Filtering is handled by computed property
}

onMounted(() => {
  financeStore.fetchPaymentLedgers()
})
</script>

<style scoped>
.payment-ledger-page {
  padding: 20px;
}

.text-red {
  color: #ff4d4f;
  font-weight: 600;
}
</style>

