<template>
  <a-card
    :title="title"
    class="card"
  >
    <a-skeleton
      :loading="loading"
      active
    >
      <!-- 📚 Documents Grid -->
      <div
        v-if="documents.length"
        class="document-grid"
      >
        <a-card
          v-for="doc in documents"
          :key="doc.id"
          class="doc-card"
          hoverable
        >
          <div class="flex flex-col items-center justify-center text-center">
            <!-- 🔷 Big Icon -->
            <component
              :is="fileTypeIcon(doc.fileType)"
              :style="{ color: fileTypeColor(doc.fileType) }"
              class="doc-icon mb-2"
            />

            <!-- 📄 File Info -->
            <h4 class="font-semibold text-base mb-1">
              {{ doc.name }}
            </h4>
            <a-tag
              color="blue"
              class="mb-1"
            >
              {{ doc.fileType.toUpperCase() }}
            </a-tag>

            <p class="text-gray-500 text-sm mb-3">
              Uploaded: {{ doc.uploadedAt }}
            </p>
          </div>
          <template #actions>
            <!-- ⬇️ Download Button -->
            <a-button
              type="primary"
              ghost
              shape="round"
              size="small"
              @click="$emit('download', doc)"
            >
              <DownloadOutlined /> Download
            </a-button>
          </template>
        </a-card>
      </div>

      <!-- 🗂 Empty State -->
      <div
        v-else-if="!loading"
        class="text-gray-500 text-center py-3"
      >
        No documents found.
      </div>
    </a-skeleton>

    <!-- ⚠️ Invalid ID -->
    <div
      v-if="invalidId"
      class="text-red-500 text-center mt-2"
    >
      Invalid student ID
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileTextOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue'

const props = defineProps<{ studentId?: number; title?: string }>()
const documents = ref<any[]>([])
const loading = ref(false)
const invalidId = ref(false)

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
    { id: 3, name: 'Medical Certificate', fileType: 'pdf', uploadedAt: '2024-08-20' },
    { id: 4, name: 'Parent Authorization Letter', fileType: 'docx', uploadedAt: '2024-09-12' }
  ]
  loading.value = false
}

function fileTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'pdf': return FilePdfOutlined
    case 'jpg':
    case 'png': return FileImageOutlined
    case 'doc':
    case 'docx': return FileWordOutlined
    default: return FileTextOutlined
  }
}

function fileTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case 'pdf': return '#cf1322'
    case 'jpg':
    case 'png': return '#1890ff'
    case 'doc':
    case 'docx': return '#2f54eb'
    default: return '#8c8c8c'
  }
}

onMounted(() => fetchDocuments(props.studentId))
watch(() => props.studentId, (v) => fetchDocuments(v))
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 8px 0;
}

.doc-card {
  border-radius: 10px;
  transition: all 0.3s ease;
  padding: 16px;
  text-align: center;
}

.doc-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.doc-icon {
  font-size: 48px;
  line-height: 1;
}

.text-gray-500 {
  color: #888;
}

.text-red-500 {
  color: #e74c3c;
}
</style>
