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
        :data-source="documents"
        bordered
        row-key="id"
        :loading="loading"
        size="small"
        :pagination="{ pageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fileType'">
            <a-tag color="blue">
              {{ record.fileType.toUpperCase() }}
            </a-tag>
          </template>

          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              size="small"
              @click="$emit('download', record)"
            >
              Download
            </a-button>
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
const documents = ref<any[]>([]);
const loading = ref(false);
const invalidId = ref(false);

const columns = [
  { title: 'Document Name', dataIndex: 'name', key: 'name' },
  { title: 'File Type', dataIndex: 'fileType', key: 'fileType' },
  { title: 'Uploaded At', dataIndex: 'uploadedAt', key: 'uploadedAt' },
  { title: 'Action', key: 'action' }
];

async function fetchDocuments(id?: number) {
  if (!id || Number.isNaN(id) || id <= 0) {
    invalidId.value = true
    documents.value = []
    return
  }
  invalidId.value = false
  loading.value = true
  await new Promise(r => setTimeout(r, 500))
  documents.value = [
    { id: 1, name: 'Report Card - Term 1', fileType: 'pdf', uploadedAt: '2024-06-10' },
    { id: 2, name: 'Student ID Copy', fileType: 'jpg', uploadedAt: '2024-07-15' },
    { id: 3, name: 'Medical Certificate', fileType: 'pdf', uploadedAt: '2024-08-20' }
  ]
  loading.value = false
}

onMounted(() => fetchDocuments(props.studentId))
watch(() => props.studentId, (v) => fetchDocuments(v))
</script>

<style scoped>
.card { border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.text-red-500 { color: #e74c3c; }
</style>
