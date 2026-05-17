<template>
  <div class="operations-container">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card :title="tl('title')">
      <a-form
        ref="formRef"
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

        <!-- Select Teacher -->
        <a-form-item
          :label="tl('form.teacher')"
          name="teacherId"
        >
          <a-select
            v-model:value="form.teacherId"
            :placeholder="tl('form.selectTeacher')"
            show-search
            :filter-option="false"
            :not-found-content="teacherLoading ? t('common.loading') : t('common.noResults')"
            @search="handleTeacherSearch"
          >
            <a-select-option
              v-for="teacher in filteredTeachers"
              :key="teacher.id"
              :value="teacher.id"
            >
              {{ teacher.firstName }} {{ teacher.lastName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Select Days -->
        <a-form-item
          :label="tl('form.days')"
          name="days"
        >
          <a-checkbox-group v-model:value="form.days">
            <a-checkbox
              v-for="day in daysOfWeek"
              :key="day"
              :value="day"
            >
              {{ t(day) }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <!-- Select Time Slot -->
        <a-form-item
          :label="tl('form.timeSlot')"
          name="timeSlot"
        >
          <a-time-picker
            v-model:value="form.timeSlot"
            format="HH:mm"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Notes -->
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
            {{ t('common.generate') }}
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

interface Class {
    id: number
    name: string
}
interface Teacher {
    id: number
    firstName: string
    lastName: string
}

const { t, tl } = useLocalI18n('operations.generateTimetable')

const loading = ref(false)
const classLoading = ref(false)
const teacherLoading = ref(false)
const formRef = ref()

const form = ref({
    classId: null as number | null,
    teacherId: null as number | null,
    days: [] as string[],
    timeSlot: null as string | null,
    notes: ''
})

const rules = {
    classId: [{ required: true, message: t('validations.required'), trigger: 'change' }],
    teacherId: [{ required: true, message: t('validations.required'), trigger: 'change' }],
    days: [{ required: true, type: 'array', min: 1, message: t('validations.required'), trigger: 'change' }],
    timeSlot: [{ required: true, message: t('validations.required'), trigger: 'change' }]
}

const daysOfWeek = [
    'common.days.monday',
    'common.days.tuesday',
    'common.days.wednesday',
    'common.days.thursday',
    'common.days.friday'
]

// Mock data (replace with API later)
const classes = ref<Class[]>([])
const teachers = ref<Teacher[]>([])
const filteredClasses = ref<Class[]>([])
const filteredTeachers = ref<Teacher[]>([])

onMounted(async () => {
    classLoading.value = true
    teacherLoading.value = true

    await new Promise(r => setTimeout(r, 300))
    classes.value = [
        { id: 1, name: 'Grade 1' },
        { id: 2, name: 'Grade 2' },
        { id: 3, name: 'Math Advanced' }
    ]
    teachers.value = [
        { id: 1, firstName: 'Mohammed', lastName: 'Saleh' },
        { id: 2, firstName: 'Layla', lastName: 'Omar' }
    ]

    filteredClasses.value = [...classes.value]
    filteredTeachers.value = [...teachers.value]
    classLoading.value = false
    teacherLoading.value = false
})

// Search filters
const handleClassSearch = async (query: string) => {
    classLoading.value = true
    await new Promise(r => setTimeout(r, 200))
    const lower = query.toLowerCase()
    filteredClasses.value = classes.value.filter(c => c.name.toLowerCase().includes(lower))
    classLoading.value = false
}

const handleTeacherSearch = async (query: string) => {
    teacherLoading.value = true
    await new Promise(r => setTimeout(r, 200))
    const lower = query.toLowerCase()
    filteredTeachers.value = teachers.value.filter(t =>
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(lower)
    )
    teacherLoading.value = false
}

// Submit handler
const handleSubmit = async () => {
    try {
        await formRef.value?.validate()
        loading.value = true

        const payload = { ...form.value }
        console.log('Generated timetable payload:', payload)
        // TODO: Call API endpoint

        message.success(tl('success'))
    } catch (error) {
        console.error(error)
        message.error(t('common.validationError'))
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
