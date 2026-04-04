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
        :data-source="data"
        bordered
        size="small"
        row-key="id"
        :pagination="false"
      />
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

const props = defineProps<{ studentId?: string; title?: string }>()
const data = ref<any[]>([]);
const loading = ref(false);
const invalidId = ref(false);

const columns = [
  { title: 'Class Name', dataIndex: 'className', key: 'className' },
  { title: 'Year', dataIndex: 'year', key: 'year' },
  { title: 'Teacher', dataIndex: 'teacher', key: 'teacher' }
];

async function fetchClassHistory(id?: string) {
  if (!id?.trim()) {
    invalidId.value = true
    data.value = []
    return
  }
  invalidId.value = false
  loading.value = true
  await new Promise(r => setTimeout(r, 400))
  data.value = [
    { id: 1, className: 'Grade 1', year: '2022-2023', teacher: 'Ms. Layla' },
    { id: 2, className: 'Math Basics', year: '2023-2024', teacher: 'Mr. Omar' }
  ]
  loading.value = false
}

onMounted(() => fetchClassHistory(props.studentId))
watch(() => props.studentId, (v) => fetchClassHistory(v))
</script>

<style scoped>
.card { border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.text-red-500 { color: #e74c3c; }
</style>
