<template>
  <a-card
    :title="title"
    class="card"
  >
    <a-skeleton
      :loading="loading"
      active
    >
      <a-descriptions
        v-if="guardian"
        size="small"
        :column="1"
        bordered
      >
        <a-descriptions-item label="Name">
          {{ guardian.name }}
        </a-descriptions-item>
        <a-descriptions-item label="Relationship">
          {{ guardian.relationship }}
        </a-descriptions-item>
        <a-descriptions-item label="Phone">
          {{ guardian.phone }}
        </a-descriptions-item>
        <a-descriptions-item label="Email">
          {{ guardian.email }}
        </a-descriptions-item>
      </a-descriptions>
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
const guardian = ref<any | null>(null);
const loading = ref(false);
const invalidId = ref(false);

async function fetchGuardian(id?: number) {
  if (!id || Number.isNaN(id) || id <= 0) {
    invalidId.value = true
    guardian.value = null
    return
  }
  invalidId.value = false
  loading.value = true
  await new Promise(r => setTimeout(r, 300))
  guardian.value = {
    id: 101,
    name: 'Ahmed Youssef',
    relationship: 'Father',
    phone: '+971 555 123 456',
    email: 'ahmed.youssef@example.com'
  }
  loading.value = false
}

onMounted(() => fetchGuardian(props.studentId))
watch(() => props.studentId, (v) => fetchGuardian(v))
</script>

<style scoped>
.card { border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.text-red-500 { color: #e74c3c; }
</style>
