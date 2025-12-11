<template>
  <div class="payment-calendar-page">
    <a-page-header
      title="Payment Calendar"
      sub-title="Visual calendar view of payment statuses"
      @back="() => $router.push({ name: 'Finance' })"
    />

    <a-card>
      <template #extra>
        <a-space>
          <a-button @click="previousMonth">
            <template #icon><LeftOutlined /></template>
            Previous
          </a-button>
          <a-button @click="nextMonth">
            Next
            <template #icon><RightOutlined /></template>
          </a-button>
          <a-button @click="currentMonth">
            Today
          </a-button>
        </a-space>
      </template>

      <div class="calendar-header">
        <h3>{{ formatMonth(currentDate) }}</h3>
      </div>

      <div class="calendar-legend">
        <a-space>
          <a-tag color="green">Paid</a-tag>
          <a-tag color="orange">Partial</a-tag>
          <a-tag color="red">Overdue</a-tag>
          <a-tag>No Payment</a-tag>
        </a-space>
      </div>

      <div class="calendar-grid">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          :class="['calendar-day', getDayClass(day)]"
        >
          <div class="day-number">{{ day.day }}</div>
          <div class="day-payments">
            <a-tag
              v-for="payment in day.payments"
              :key="payment.id"
              :color="getStatusColor(payment.status)"
              size="small"
            >
              {{ payment.amount }} TND
            </a-tag>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { useFinanceStore } from '@/stores/financeStore'
import dayjs from 'dayjs'

const router = useRouter()
const financeStore = useFinanceStore()
const { paymentLedgers, loading } = financeStore

const currentDate = ref(dayjs())

interface CalendarDay {
  date: string
  day: number
  payments: Array<{ id: string; amount: number; status: string }>
}

const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []
  const startOfMonth = currentDate.value.startOf('month')
  const daysInMonth = currentDate.value.daysInMonth()
  const startDay = startOfMonth.day() // 0 = Sunday, 6 = Saturday

  // Add empty days at the start
  for (let i = 0; i < startDay; i++) {
    days.push({
      date: '',
      day: 0,
      payments: []
    })
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = startOfMonth.date(day).format('YYYY-MM-DD')
    const monthStr = currentDate.value.format('YYYY-MM')
    
    // Find payments for this day
    const dayPayments = paymentLedgers.value
      .filter(ledger => {
        const dueDate = dayjs(ledger.dueDate)
        return dueDate.format('YYYY-MM-DD') === date
      })
      .map(ledger => ({
        id: ledger.id,
        amount: ledger.amountDue,
        status: ledger.status
      }))

    days.push({
      date,
      day,
      payments: dayPayments
    })
  }

  return days
})

const formatMonth = (date: dayjs.Dayjs) => {
  return date.format('MMMM YYYY')
}

const getDayClass = (day: CalendarDay) => {
  if (!day.date) return 'empty-day'
  if (day.payments.length === 0) return 'no-payment'
  
  const hasOverdue = day.payments.some(p => p.status === 'overdue')
  const hasPartial = day.payments.some(p => p.status === 'partial')
  const allPaid = day.payments.every(p => p.status === 'paid')
  
  if (hasOverdue) return 'overdue-day'
  if (hasPartial) return 'partial-day'
  if (allPaid) return 'paid-day'
  return ''
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

const previousMonth = () => {
  currentDate.value = currentDate.value.subtract(1, 'month')
}

const nextMonth = () => {
  currentDate.value = currentDate.value.add(1, 'month')
}

const currentMonth = () => {
  currentDate.value = dayjs()
}

onMounted(() => {
  financeStore.fetchPaymentLedgers()
})
</script>

<style scoped>
.payment-calendar-page {
  padding: 20px;
}

.calendar-header {
  margin-bottom: 20px;
  text-align: center;
}

.calendar-legend {
  margin-bottom: 20px;
  text-align: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  min-height: 100px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px;
  background: #fff;
}

.calendar-day.empty-day {
  background: #f5f5f5;
  border: none;
}

.calendar-day.no-payment {
  background: #fafafa;
}

.calendar-day.paid-day {
  background: #f6ffed;
  border-color: #52c41a;
}

.calendar-day.partial-day {
  background: #fff7e6;
  border-color: #faad14;
}

.calendar-day.overdue-day {
  background: #fff1f0;
  border-color: #ff4d4f;
}

.day-number {
  font-weight: 600;
  margin-bottom: 4px;
}

.day-payments {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>

