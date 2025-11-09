<template>
  <a-card
    :title="title"
    class="card"
  >
    <a-skeleton
      :loading="loading"
      active
    >
      <a-table
        :columns="columns"
        :data-source="payments"
        bordered
        row-key="id"
        :loading="loading"
        size="small"
        :pagination="{ pageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'Paid' ? 'green' : 'red'">
              {{ record.status }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-skeleton>
    <div
      v-if="invalidId"
      class="text-red-500"
    >
      Invalid student id
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{ studentId?: number, title?: string }>();
const payments = ref<any[]>([]);
const loading = ref(false);
const invalidId = ref(false);

const columns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Amount (AED)', dataIndex: 'amount', key: 'amount' },
  { title: 'Method', dataIndex: 'method', key: 'method' },
  { title: 'Status', dataIndex: 'status', key: 'status' }
];

async function fetchPayments(id?: number) {
  if (!id || Number.isNaN(id) || id <= 0) {
    invalidId.value = true
    payments.value = []
    return
  }
  invalidId.value = false
  loading.value = true
  await new Promise(r => setTimeout(r, 400))
  payments.value = [
    { id: 1, date: '2024-01-05', amount: 1200, method: 'Card', status: 'Paid' },
    { id: 2, date: '2024-05-05', amount: 1200, method: 'Cash', status: 'Paid' },
    { id: 3, date: '2024-09-05', amount: 1200, method: 'Card', status: 'Pending' }
  ]
  loading.value = false
}

onMounted(() => fetchPayments(props.studentId))
watch(() => props.studentId, (v) => fetchPayments(v))
</script>

<style scoped>
.card { border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.text-red-500 { color: #e74c3c; }
</style>
