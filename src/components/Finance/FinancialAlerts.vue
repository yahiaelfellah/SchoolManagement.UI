<template>
  <a-badge
    :count="alertCount"
    :number-style="{ backgroundColor: '#ff4d4f' }"
  >
    <a-popover
      placement="bottomRight"
      :title="`Financial Alerts (${alertCount})`"
      trigger="click"
    >
      <template #content>
        <a-list
          :data-source="alerts"
          :loading="loading"
          size="small"
          :pagination="{ pageSize: 5 }"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <a-space>
                    <component :is="getAlertIcon(item.type)" />
                    {{ item.title }}
                  </a-space>
                </template>
                <template #description>
                  {{ item.description }}
                  <br>
                  <span class="text-gray">{{ formatDate(item.timestamp) }}</span>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
        <a-divider style="margin: 8px 0" />
        <a-button
          type="link"
          block
          @click="handleViewAll"
        >
          View All Alerts
        </a-button>
      </template>
      <a-button
        type="text"
        class="alert-button"
      >
        <template #icon>
          <BellOutlined />
        </template>
      </a-button>
    </a-popover>
  </a-badge>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  BellOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'
import { useFinanceStore } from '@/stores/financeStore'
import dayjs from 'dayjs'

const router = useRouter()
const financeStore = useFinanceStore()

const loading = computed(() => financeStore.loading)
const overdueStudents = computed(() => financeStore.overdueStudents)
const partialPaymentCount = computed(() => financeStore.partialPaymentCount)

interface Alert {
  id: string
  type: 'overdue' | 'partial' | 'missed' | 'service'
  title: string
  description: string
  timestamp: string
  studentId?: number
}

const alerts = computed<Alert[]>(() => {
  const alertList: Alert[] = []

  // Overdue alerts
  overdueStudents.value.forEach(student => {
    alertList.push({
      id: `overdue-${student.studentId}`,
      type: 'overdue',
      title: `Overdue Payment: ${student.studentName}`,
      description: `${student.overdueAmount.toLocaleString()} TND overdue`,
      timestamp: new Date().toISOString(),
      studentId: student.studentId
    })
  })

  // Partial payment alerts
  if (partialPaymentCount.value > 0) {
    alertList.push({
      id: 'partial-payments',
      type: 'partial',
      title: `${partialPaymentCount.value} Partial Payments`,
      description: 'Students with partial payments need attention',
      timestamp: new Date().toISOString()
    })
  }

  return alertList.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})

const alertCount = computed(() => alerts.value.length)

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'overdue':
      return ExclamationCircleOutlined
    case 'partial':
      return WarningOutlined
    default:
      return InfoCircleOutlined
  }
}

const formatDate = (date: string) => {
  return dayjs(date).format('DD MMM YYYY HH:mm')
}

const handleViewAll = () => {
  router.push({ name: 'Finance' })
}

onMounted(() => {
  financeStore.fetchPaymentLedgers()
})
</script>

<style scoped>
.alert-button {
  font-size: 18px;
}

.text-gray {
  color: #888;
  font-size: 12px;
}
</style>

