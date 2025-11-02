<template>
  <div class="operations-container">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card :title="tl('title')">
      <a-form
        ref="paymentFormRef"
        layout="vertical"
        :model="form"
        :rules="rules"
        @finish="handleSubmit"
      >
        <!-- Select Student -->
        <a-form-item
          :label="tl('form.student')"
          name="studentId"
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

        <!-- Payment Amount -->
        <a-form-item
          :label="tl('form.amount')"
          name="amount"
        >
          <a-input-number
            v-model:value="form.amount"
            :min="0"
            :placeholder="tl('form.enterAmount')"
            style="width: 100%"
          />
        </a-form-item>

        <!-- Payment Method -->
        <a-form-item
          :label="tl('form.method')"
          name="method"
        >
          <a-select
            v-model:value="form.method"
            :placeholder="tl('form.selectMethod')"
          >
            <a-select-option value="cash">
              {{ tl('form.methods.cash') }}
            </a-select-option>
            <a-select-option value="card">
              {{ tl('form.methods.card') }}
            </a-select-option>
            <a-select-option value="bank">
              {{ tl('form.methods.bank') }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Payment Date -->
        <a-form-item
          :label="tl('form.date')"
          name="date"
        >
          <a-date-picker
            v-model:value="form.date"
            style="width: 100%"
            format="YYYY-MM-DD"
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

        <!-- Submit -->
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
          >
            {{ t('common.save') }}
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
import type Student from '@/model/student'


const { t, tl } = useLocalI18n('operations.addPayment')

const paymentFormRef = ref()
const loading = ref(false)
const studentLoading = ref(false)

const form = ref({
  studentId: null as number | null,
  amount: null as number | null,
  method: null as string | null,
  date: null as string | null,
  notes: ''
})

const rules = {
  studentId: [{ required: true, message: t('common.validations.required'), trigger: 'change' }],
  amount: [{ required: true, message: t('common.validations.required'), trigger: 'change' }],
  method: [{ required: true, message: t('common.validations.required'), trigger: 'change' }],
  date: [{ required: true, message: t('common.validations.required'), trigger: 'change' }]
}

// Mock Data (replace with API)
const students = ref<Student[]>([])
const filteredStudents = ref<Student[]>([])

onMounted(async () => {
  studentLoading.value = true
  await new Promise(r => setTimeout(r, 300))
  students.value = [
    { id: 1, firstName: 'Ali', lastName: 'Ahmed' },
    { id: 2, firstName: 'Sara', lastName: 'Mohamed' }
  ]
  filteredStudents.value = [...students.value]
  studentLoading.value = false
})

// Search student
const handleStudentSearch = async (query: string) => {
  studentLoading.value = true
  await new Promise(r => setTimeout(r, 250))
  const lower = query.toLowerCase()
  filteredStudents.value = students.value.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(lower)
  )
  studentLoading.value = false
}

// Submit handler
const handleSubmit = async () => {
  try {
    await paymentFormRef.value?.validate()
    loading.value = true

    const payload = { ...form.value }
    console.log('Payment payload:', payload)
    // TODO: API call for payment submission

    message.success(tl('success'))
  } catch (err) {
    console.error(err)
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
