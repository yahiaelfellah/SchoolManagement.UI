<template>
  <div class="students-view">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
    />

    <!-- Filter component -->
    <Filter
      :filters="{ searchTerm }"
      @search="handleSearch"
      @reset="resetFilters"
    />

    <!-- List layout with avatar, meta and actions -->
    <a-card class="mt-4">
      <a-list
        item-layout="horizontal"
        :data-source="filteredStudents"
        :pagination="{ pageSize: 8 }"
        :loading="store.loading"
      >
        <template #renderItem="{ item }">
          <a-list-item :key="item.id">
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :src="avatarFor(item)" />
              </template>
              <template #title>
                {{ item.firstName }} {{ item.lastName }}
              </template>
              <template #description>
                Class: {{ item.className }} • Enrolled: {{ item.enrolledSince }}
              </template>
            </a-list-item-meta>

            <div style="display:flex;align-items:center;gap:12px;">
              <!-- <a-tag :color="getAttendanceColor(item.attendance)">
                {{ item.attendance }}
              </a-tag> -->
              <a-button
                type="link"
                @click.stop="viewStudentDetails(item)"
              >
                {{ t('common.viewDetails') }}
              </a-button>

              <!-- Delete action: open modal -->
              <a-button
                danger
                @click.stop="openDeleteModal(item)"
              >
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
            </div>
          </a-list-item>
        </template>
      </a-list>

      <!-- Delete confirmation modal -->
      <a-modal
        v-model:visible="deleteModalVisible"
        title="Confirm deletion"
        ok-text="Delete"
        ok-type="danger"
        @ok="confirmDelete"
        @cancel="cancelDelete"
      >
        <p>Are you sure you want to delete <strong>{{ deleteTargetName }}</strong>?</p>
      </a-modal>

      <div
        v-if="!filteredStudents.length && !store.loading"
        class="empty-state"
      >
        {{ t('common.noResults') }}
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import { DeleteOutlined } from '@ant-design/icons-vue'
import Filter from '@/components/Filter.vue'
import { useStudentStore } from '@/stores/studentStore' // <--- use the new store

const { t, tl } = useLocalI18n('operations.students.view')
const router = useRouter()

// ---------- STATE ----------
const store = useStudentStore()
const searchTerm = ref('')

// modal state for deletion
const deleteModalVisible = ref(false)
const deleteTargetId = ref<string | null>(null)
const deleteTargetName = ref('')

// ---------- LIFECYCLE ----------
onMounted(async () => {
  await store.fetchStudents() // fetch from store's mocked API
})

// ---------- FILTERING ----------
const filteredStudents = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return store.students
  return store.students.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(term) ||
    s.className.toLowerCase().includes(term)
  )
})

const handleSearch = (filters: Record<string, string>) => {
  searchTerm.value = filters.searchTerm || ''
}

const resetFilters = () => {
  searchTerm.value = ''
}

// ---------- ACTIONS ----------
const viewStudentDetails = (record: any) => {
  router.push(`/students/${record.id}`)
}

// open modal with selected student
const openDeleteModal = (item: any) => {
  deleteTargetId.value = item.id
  deleteTargetName.value = `${item.firstName} ${item.lastName}`
  deleteModalVisible.value = true
}

const confirmDelete = async () => {
  if (deleteTargetId.value !== null) {
    try {
      await deleteStudent(deleteTargetId.value)
      message.success(t('common.deleted') || 'Student deleted')
    } catch {
      message.error(t('common.error'))
    }
  }
  deleteModalVisible.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

const cancelDelete = () => {
  deleteModalVisible.value = false
  deleteTargetId.value = null
  deleteTargetName.value = ''
}

const deleteStudent = (id: string) => store.deleteStudent(id)

// ---------- HELPERS ----------
const avatarFor = (s: any) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(s.firstName + ' ' + s.lastName)}&background=1677ff&color=fff&size=64`
</script>

<style scoped>
.students-view {
  max-width: 80vw;
  margin: auto;
  padding: 24px;
}

.mt-4 {
  margin-top: 16px;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}
</style>
