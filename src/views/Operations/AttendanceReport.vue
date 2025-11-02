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
        :model="form"
        :rules="rules"
        layout="inline"
      >
        <!-- Class Selector -->
        <a-form-item
          :label="tl('form.class')"
          name="classId"
        >
          <a-select
            v-model:value="form.classId"
            style="width: 220px"
            :placeholder="tl('form.selectClass')"
            :loading="classLoading"
            allow-clear
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

        <a-form-item>
          <a-button
            type="primary"
            :loading="loading"
            @click="generateReport"
          >
            {{ t('common.generate') }}
          </a-button>
        </a-form-item>
      </a-form>

      <!-- Attendance Report Table -->
      <div
        v-if="!loading && reportData.length"
        class="mt-4"
      >
        <a-table
          :data-source="reportData"
          :columns="columns"
          row-key="id"
          bordered
          :pagination="false"
        />
      </div>

      <!-- Loading / Empty State -->
      <div
        v-else-if="loading"
        class="mt-4 text-gray-500"
      >
        {{ t('common.loading') }}
      </div>
      <div
        v-else-if="form.classId && !reportData.length"
        class="mt-4 text-gray-500"
      >
        {{ t('common.noResults') }}
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'

const { t, tl } = useLocalI18n('operations.attendanceReport')

// ---------- State ----------
const formRef = ref<FormInstance>()
const form = ref({
  classId: null as number | null
})
const rules = {
  classId: [{ required: true, message: t('common.validations.required') }]
}
const loading = ref(false)
const classLoading = ref(false)
const reportData = ref<any[]>([])
const classes = ref<{ id: number; name: string }[]>([])

// ---------- Mock API ----------
const mockApi = {
  async getClasses() {
    await new Promise(r => setTimeout(r, 600))
    return [
      { id: 1, name: 'Grade 1' },
      { id: 2, name: 'Grade 2' },
      { id: 3, name: 'Math Advanced' }
    ]
  },
  async getAttendanceReport(classId: number) {
    await new Promise(r => setTimeout(r, 800))
    if (classId === 1)
      return [
        { id: 1, student: 'Ali Ahmed', presentDays: 18, absentDays: 2, rate: '90%' },
        { id: 2, student: 'Sara Mohamed', presentDays: 19, absentDays: 1, rate: '95%' }
      ]
    if (classId === 2)
      return [
        { id: 3, student: 'Hassan Ali', presentDays: 16, absentDays: 4, rate: '80%' },
        { id: 4, student: 'Noura Yassin', presentDays: 20, absentDays: 0, rate: '100%' }
      ]
    return [
      { id: 5, student: 'Khaled Mansour', presentDays: 15, absentDays: 5, rate: '75%' }
    ]
  }
}

// ---------- Lifecycle ----------
onMounted(async () => {
  classLoading.value = true
  try {
    classes.value = await mockApi.getClasses()
  } finally {
    classLoading.value = false
  }
})

// ---------- Columns ----------
const columns = [
  { title: tl('table.student'), dataIndex: 'student', key: 'student' },
  { title: tl('table.presentDays'), dataIndex: 'presentDays', key: 'presentDays' },
  { title: tl('table.absentDays'), dataIndex: 'absentDays', key: 'absentDays' },
  { title: tl('table.attendanceRate'), dataIndex: 'rate', key: 'rate' }
]

// ---------- Generate Report ----------
const generateReport = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return message.error(t('common.validations.required'))
  }

  loading.value = true
  reportData.value = []

  try {
    const data = await mockApi.getAttendanceReport(form.value.classId!)
    reportData.value = data
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
.mt-4 {
  margin-top: 16px;
}
.text-gray-500 {
  color: #888;
  text-align: center;
  font-style: italic;
}
</style>
