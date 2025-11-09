<template>
  <div class="operations-container">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card :title="tl('title')">
      <a-form
        ref="enrollFormRef"
        layout="vertical"
        :model="form"
        :rules="rules"
        @finish="handleSubmit"
      >
        <!-- Step 1: Select Student -->
        <a-form-item
          :label="tl('form.student')"
          name="studentId"
          :rules="[{ required: true, message: t('validations.required') }]"
        >
          <a-select
            v-model:value="form.studentId"
            :placeholder="tl('form.selectStudent')"
            show-search
            :filter-option="false"
            :not-found-content="studentLoading ? t('common.loading') : t('common.noResults')"
            @search="handleStudentSearch"
          >
            <a-select-option
              v-for="student in filteredStudents"
              :key="student.id"
              :value="student.id"
            >
              {{ student.firstName }} {{ student.lastName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Step 2: Select Class -->
        <a-form-item
          :label="tl('form.class')"
          name="classId"
          :rules="[{ required: true, message: t('validations.required') }]"
        >
          <a-select
            v-model:value="form.classId"
            :placeholder="tl('form.selectClass')"
            show-search
            :filter-option="false"
            :not-found-content="classLoading ? t('common.loading') : t('common.noResults')"
            @search="handleClassSearch"
          >
            <a-select-option
              v-for="cls in filteredClasses"
              :key="cls.id"
              :value="cls.id"
            >
              {{ cls.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Step 3: Enrollment Date -->
        <a-form-item
          :label="tl('form.enrollmentDate')"
          name="enrollmentDate"
          :rules="[{ required: true, message: t('validations.required') }]"
        >
          <a-date-picker
            v-model:value="form.enrollmentDate"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Step 4: Notes -->
        <a-form-item
          :label="tl('form.notes')"
          name="notes"
        >
          <a-textarea
            v-model:value="form.notes"
            rows="3"
            :placeholder="tl('form.notesPlaceholder')"
          />
        </a-form-item>

        <a-form-item>
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
import { ref } from 'vue'
import { useDialogStore } from '@/stores/operationsDialog'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import type Student from '@/model/student'
import type Class from '@/model/class'

// Scoped i18n helper
const { t, tl } = useLocalI18n('operations.students.enrollStudent')

const dialogStore = useDialogStore()
const enrollFormRef = ref()

const loading = ref(false)
const studentLoading = ref(false)
const classLoading = ref(false)

// --- Form model ---
const form = ref({
  studentId: null as number | null,
  classId: null as number | null,
  enrollmentDate: null as Date | null,
  notes: '',
})

// --- Validation rules ---
const rules = {
  studentId: [{ required: true, message: t('validations.required'), trigger: 'change' }],
  classId: [{ required: true, message: t('validations.required'), trigger: 'change' }],
  enrollmentDate: [{ required: true, message: t('validations.required'), trigger: 'change' }],
}

// --- Mock Data (replace with API) ---
const students = ref<Student[]>([
  { id: 1, firstName: 'Ali', lastName: 'Ahmed' },
  { id: 2, firstName: 'Sara', lastName: 'Mohamed' },
  { id: 3, firstName: 'Mona', lastName: 'Ibrahim' },
])

const classes = ref<Class[]>([
  { id: 1, name: 'Grade 1' },
  { id: 2, name: 'Grade 2' },
  { id: 3, name: 'Math Advanced' },
])

const filteredStudents = ref([...students.value])
const filteredClasses = ref([...classes.value])

// --- Search ---
const handleStudentSearch = async (query: string) => {
  studentLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  const q = query.toLowerCase()
  filteredStudents.value = students.value.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
  )
  studentLoading.value = false
}

const handleClassSearch = async (query: string) => {
  classLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  const q = query.toLowerCase()
  filteredClasses.value = classes.value.filter(c =>
    c.name.toLowerCase().includes(q)
  )
  classLoading.value = false
}

// --- Submit ---
const handleSubmit = async () => {
  if (!enrollFormRef.value) return
  try {
    await enrollFormRef.value.validate()
    loading.value = true
    const payload = { ...form.value }
    console.log('Enrollment Payload:', payload)
    // TODO: call API
    dialogStore.closeDialog()
  } catch (err) {
    console.error('Validation failed', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.operations-container {
  max-width: 50vw;
  margin: auto;
  padding: 20px;
}
</style>
