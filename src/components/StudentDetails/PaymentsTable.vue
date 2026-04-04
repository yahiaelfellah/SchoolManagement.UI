<template>
  <a-card
    :title="title"
    class="card"
  >
    <template #extra>
      <a-button
        type="primary"
        @click="goToPaymentView"
      >
        <CreditCardOutlined /> Add
      </a-button>
    </template>
    <a-skeleton
      :loading="loading"
      active
    >
      <!-- ⚠️ Overdue Warning -->
      <div
        v-if="hasOverdue"
        class="warning-banner mb-3"
      >
        <ExclamationCircleOutlined />
        <span>There are overdue payments that need attention!</span>
      </div>

      <!-- 💸 Payment List -->
      <a-list
        v-if="payments.length"
        :data-source="payments"
        class="payment-list"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item class="payment-item">
            <a-list-item-meta
              :title="`Due ${item.date}`"
              :description="`${item.status} • Due date billing`"
            />
            <div class="status-container">
              <a-tag
                :color="statusTagColor(item.status)"
                class="ml-2"
              >
                {{ item.status }}
              </a-tag>
            </div>
          </a-list-item>
        </template>
      </a-list>

      <div
        v-else-if="!loading"
        class="text-gray-500 text-center py-3"
      >
        No payment records found.
      </div>
    </a-skeleton>

    <div
      v-if="invalidId"
      class="text-red-500 text-center mt-2"
    >
      Invalid student ID
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  CreditCardOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import * as paymentsApi from '@/api/payments'
import { ApiError } from '@/api/client'

const router = useRouter()
const props = defineProps<{ studentId?: string; title?: string }>()

const payments = ref<
  { id: string; date: string; amount: number; method: string; status: string }[]
>([])
const loading = ref(false)
const invalidId = ref(false)

async function fetchPayments(id?: string) {
  if (!id?.trim()) {
    invalidId.value = true
    payments.value = []
    return
  }

  invalidId.value = false
  loading.value = true
  try {
    const rows = await paymentsApi.fetchPaymentsByStudent(id)
    payments.value = rows.map(p => {
      const due = p.dueDate?.split('T')[0] ?? p.dueDate
      const overdue = !p.isPaid && due && new Date(due) < new Date()
      const status = p.isPaid ? 'Paid' : overdue ? 'Overdue' : 'Pending'
      return {
        id: p.id,
        date: due,
        amount: 0,
        method: '—',
        status,
      }
    })
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      payments.value = []
    } else {
      throw e
    }
  } finally {
    loading.value = false
  }
}

const hasOverdue = computed(() =>
  payments.value.some(p => p.status === 'Overdue')
)

const statusTagColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'green'
    case 'Pending':
      return 'orange'
    case 'Overdue':
      return 'red'
    default:
      return 'default'
  }
}

function goToPaymentView() {
  if (!props.studentId) return
  router.push({
    path: '/finance',
    query: { studentId: props.studentId },
  })
}

onMounted(() => fetchPayments(props.studentId))
watch(() => props.studentId, v => fetchPayments(v))
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.payment-list {
  overflow-y: auto;
}

.payment-item {
  padding: 10px 12px;
  transition: background 0.3s;
}
.payment-item:hover {
  background: #fafafa;
}

.status-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 120px;
}

.warning-banner {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  color: #ad6800;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.text-gray-500 {
  color: #888;
}
.text-red-500 {
  color: #e74c3c;
}
</style>
