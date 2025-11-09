<template>
  <div class="students-view">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
    />
    <!-- 🔍 Filter -->
    <Filter
      :filters="{ searchTerm }"
      @search="handleSearch"
      @reset="resetFilters"
    />


    <!-- 🧾 Students Table -->
    <a-table
      :data-source="filteredStudents"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="{ pageSize: 8 }"
    >
      <template #bodyCell="{ column, record }">
        <!-- Attendance Tag -->
        <template v-if="column.key === 'attendance'">
          <a-tag :color="getAttendanceColor(record.attendance)">
            {{ record.attendance }}
          </a-tag>
        </template>

        <!-- Full Name -->
        <template v-else-if="column.key === 'fullName'">
          {{ record.firstName }} {{ record.lastName }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button
            type="link" 
            @click.stop="viewStudentDetails(record)"
          >
            {{ t('common.viewDetails') }}
          </a-button>
        </template>
      </template>
    </a-table>

    <!-- Empty state -->
    <div
      v-if="!filteredStudents.length && !loading"
      class="empty-state"
    >
      {{ t('common.noResults') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'

interface Student {
  id: number
  firstName: string
  lastName: string
  className: string
  enrolledSince: string
  attendance: 'Present' | 'Absent' | 'Late'
}

const { t, tl } = useLocalI18n('operations.students.view')
const router = useRouter()

// ---------- STATE ----------
const loading = ref(false)
const students = ref<Student[]>([])
const searchTerm = ref('')

// ---------- MOCK API ----------
const mockApi = {
  async getStudents(): Promise<Student[]> {
    await new Promise(r => setTimeout(r, 700))
    return [
      { id: 1, firstName: 'Ali', lastName: 'Ahmed', className: 'Grade 1', enrolledSince: '2023-09-01', attendance: 'Present' },
      { id: 2, firstName: 'Sara', lastName: 'Mohamed', className: 'Grade 2', enrolledSince: '2022-09-01', attendance: 'Absent' },
      { id: 3, firstName: 'Omar', lastName: 'Hassan', className: 'Grade 1', enrolledSince: '2023-02-15', attendance: 'Late' },
      { id: 4, firstName: 'Layla', lastName: 'Khaled', className: 'Math Advanced', enrolledSince: '2024-01-10', attendance: 'Present' },
      { id: 5, firstName: 'Hassan', lastName: 'Ali', className: 'Science', enrolledSince: '2022-06-01', attendance: 'Present' },
      { id: 6, firstName: 'Noura', lastName: 'Yassin', className: 'Grade 2', enrolledSince: '2023-04-20', attendance: 'Absent' },
      { id: 7, firstName: 'Fatima', lastName: 'Hassan', className: 'Grade 3', enrolledSince: '2024-02-01', attendance: 'Late' }
    ]
  }
}

// ---------- LIFECYCLE ----------
onMounted(async () => {
  loading.value = true
  try {
    students.value = await mockApi.getStudents()
  } catch (err) {
    console.error(err)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
})

// ---------- FILTERING ----------
// Update filtering logic to use the search term from the Filter component
const filteredStudents = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return students.value
  return students.value.filter(s =>
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
const viewStudentDetails = (record: Student) => {
  router.push(`/students/${record.id}`)
}

// ---------- HELPERS ----------
const getAttendanceColor = (status: string) => {
  switch (status) {
    case 'Present': return 'green'
    case 'Absent': return 'red'
    case 'Late': return 'orange'
    default: return 'default'
  }
}

// ---------- TABLE COLUMNS ----------
const columns = [
  {
    title: tl('table.fullName'),
    key: 'fullName',
    sorter: (a: Student, b: Student) => a.firstName.localeCompare(b.firstName)
  },
  {
    title: tl('table.class'),
    dataIndex: 'className',
    key: 'className',
    sorter: (a: Student, b: Student) => a.className.localeCompare(b.className)
  },
  {
    title: tl('table.enrolledSince'),
    dataIndex: 'enrolledSince',
    key: 'enrolledSince',
    sorter: (a: Student, b: Student) =>
      new Date(a.enrolledSince).getTime() - new Date(b.enrolledSince).getTime()
  },
  {
    title: tl('table.attendance'),
    dataIndex: 'attendance',
    key: 'attendance',
    sorter: (a: Student, b: Student) => a.attendance.localeCompare(b.attendance)
  },  {
    title: 'Action',
    key: 'action',
  },
]
</script>

<style scoped>
.students-view {
  max-width: 80vw;
  margin: auto;
  padding: 24px;
}

.filter-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.ant-table-row:hover {
  cursor: pointer;
  background-color: #fafafa !important;
  transition: background 0.3s;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}
</style>
