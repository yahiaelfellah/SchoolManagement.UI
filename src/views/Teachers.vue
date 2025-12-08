<template>
  <div class="teachers-view">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
    />

    <!-- 🔍 Filter component -->
    <Filter
      :filters="{ searchTerm }"
      @search="handleSearch"
      @reset="resetFilters"
    />

    <!-- 👩‍🏫 Teacher List -->
    <a-card class="mt-4">
      <a-list
        item-layout="horizontal"
        :data-source="filteredTeachers"
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
                Subject: {{ item.subject }} • Class: {{ item.classAssigned }} • Hired: {{ item.hiredSince }}
              </template>
            </a-list-item-meta>

            <div style="display:flex;align-items:center;gap:12px;">
              <a-tag :color="statusColor(item.status)">
                {{ item.status }}
              </a-tag>

              <a-button
                type="link"
                @click.stop="viewTeacherDetails(item)"
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
        v-if="!filteredTeachers.length && !store.loading"
        class="empty-state"
      >
        {{ t('common.noResults') }}
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// filepath: src/views/Teachers.vue
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import { DeleteOutlined } from '@ant-design/icons-vue'
import Filter from '@/components/Filter.vue'
import { useTeacherStore } from '@/stores/teacherStore'

const { t, tl } = useLocalI18n('operations.teachers.view')
const router = useRouter()

// ---------- STATE ----------
const store = useTeacherStore()
const searchTerm = ref('')

// modal state for deletion
const deleteModalVisible = ref(false)
const deleteTargetId = ref<number | null>(null)
const deleteTargetName = ref('')

// ---------- LIFECYCLE ----------
onMounted(async () => {
  await store.fetchTeachers()
})

// ---------- FILTERING ----------
const filteredTeachers = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return store.teachers
  return store.teachers.filter(t =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(term) ||
    t.subject.toLowerCase().includes(term) ||
    t.classAssigned.toLowerCase().includes(term)
  )
})

const handleSearch = (filters: Record<string, string>) => {
  searchTerm.value = filters.searchTerm || ''
}

const resetFilters = () => {
  searchTerm.value = ''
}

// ---------- ACTIONS ----------
const viewTeacherDetails = (record: any) => {
  router.push(`/teachers/${record.id}`)
}

// open modal with selected teacher
const openDeleteModal = (item: any) => {
  deleteTargetId.value = item.id
  deleteTargetName.value = `${item.firstName} ${item.lastName}`
  deleteModalVisible.value = true
}

const confirmDelete = () => {
  if (deleteTargetId.value !== null) {
    deleteTeacher(deleteTargetId.value)
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

// delete teacher locally with confirmation
const deleteTeacher = (id: number) => {
  const idx = store.teachers.findIndex((t: any) => t.id === id)
  if (idx === -1) {
    message.error(t('common.error'))
    return
  }
  store.deleteTeacher(id)
  message.success(t('common.deleted') || 'Teacher deleted')
}

// ---------- HELPERS ----------
const avatarFor = (t: any) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(t.firstName + ' ' + t.lastName)}&background=1677ff&color=fff&size=64`

const statusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'green'
    case 'On Leave': return 'orange'
    default: return 'red'
  }
}
</script>

<style scoped>
.teachers-view {
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
