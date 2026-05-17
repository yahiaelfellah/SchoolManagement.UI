<template>
  <div class="operations-container">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card :title="tl('title')">
      <a-form
        ref="attendanceFormRef"
        layout="vertical"
        :model="form"
        :rules="rules"
        @finish="handleSubmit"
      >
        <!-- Select Class -->
        <a-form-item
          :label="tl('form.class')"
          name="classId"
        >
          <a-select
            v-model:value="form.classId"
            :placeholder="tl('form.selectClass')"
            :loading="classLoading"
            @change="fetchStudents"
          >
            <a-select-option
              v-for="cls in classes"
              :key="cls.id"
              :value="cls.id"
            >
              {{ cls.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Select Date -->
        <a-form-item
          :label="tl('form.date')"
          name="date"
        >
          <a-date-picker
            v-model:value="form.date"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Attendance Table -->
        <a-divider orientation="left">
          {{ tl('form.attendanceList') }}
        </a-divider>

        <a-alert
          v-if="!students.length && !studentLoading && form.classId"
          type="info"
          :message="tl('form.noStudents')"
          show-icon
        />

        <a-spin :spinning="studentLoading">
          <a-table
            v-if="students.length"
            :data-source="students"
            :pagination="false"
            row-key="id"
          >
            <a-table-column
              :title="t('common.name')"
              data-index="name"
            />
            <a-table-column :title="tl('form.status.title')">
              <template #default="{ record }">
                <a-select
                  v-model:value="record.status"
                  style="width: 120px"
                >
                  <a-select-option value="present">
                    {{ tl('form.status.present') }}
                  </a-select-option>
                  <a-select-option value="absent">
                    {{ tl('form.status.absent') }}
                  </a-select-option>
                  <a-select-option value="late">
                    {{ tl('form.status.late') }}
                  </a-select-option>
                </a-select>
              </template>
            </a-table-column>
          </a-table>
        </a-spin>

        <a-form-item style="margin-top: 24px;">
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
          >
            {{ t('common.submit') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'

const { t, tl } = useLocalI18n('operations.markAttendance')

// Form + validation
const attendanceFormRef = ref()
const form = ref({
  classId: null as number | null,
  date: null as string | null
})

const rules = {
  classId: [{ required: true, message: t('validations.required'), trigger: 'change' }],
  date: [{ required: true, message: t('validations.required'), trigger: 'change' }]
}

// Loading and data refs
const loading = ref(false)
const classLoading = ref(false)
const studentLoading = ref(false)
const classes = ref<{ id: number; name: string }[]>([])
const students = ref<{ id: number; name: string; status: string }[]>([])

// Mocked API
const mockApi = {
  fetchClasses: async () => {
    await new Promise(r => setTimeout(r, 300))
    return [
      { id: 1, name: 'Grade 1' },
      { id: 2, name: 'Grade 2' },
      { id: 3, name: 'Grade 3' }
    ]
  },
  fetchStudentsByClass: async (classId: number) => {
    await new Promise(r => setTimeout(r, 500))
    const data: Record<number, { id: number; name: string }[]> = {
      1: [
        { id: 1, name: 'Ali Ahmed' },
        { id: 2, name: 'Sara Mohamed' },
        { id: 3, name: 'Youssef Ibrahim' }
      ],
      2: [
        { id: 4, name: 'Layla Omar' },
        { id: 5, name: 'Omar Khaled' }
      ],
      3: [
        { id: 6, name: 'Fatima Nasser' },
        { id: 7, name: 'Mohammed Saleh' }
      ]
    }
    return data[classId] || []
  }
}

// Load classes
onMounted(async () => {
  classLoading.value = true
  classes.value = await mockApi.fetchClasses()
  classLoading.value = false
})

// Fetch students when class changes
const fetchStudents = async (classId: number) => {
  studentLoading.value = true
  students.value = []
  try {
    const data = await mockApi.fetchStudentsByClass(classId)
    students.value = data.map(s => ({ ...s, status: 'present' }))
  } catch {
    message.error(t('common.error'))
  } finally {
    studentLoading.value = false
  }
}

// Submit handler with validation
const handleSubmit = async () => {
  if (!attendanceFormRef.value) return
  try {
    await attendanceFormRef.value.validate()

    if (students.value.length === 0) {
      message.warning(tl('form.noStudents'))
      return
    }

    loading.value = true
    await new Promise(r => setTimeout(r, 500))

    const payload = {
      classId: form.value.classId,
      date: form.value.date,
      attendance: students.value.map(s => ({
        id: s.id,
        status: s.status
      }))
    }

    console.log('✅ Timetable payload:', payload)
    message.success(tl('success'))
  } catch (err) {
    console.error(err)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.operations-container {
  max-width: 60vw;
  margin: auto;
  padding: 20px;
}
</style>
