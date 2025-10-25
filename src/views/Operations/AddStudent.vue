<template>
  <div class="add-student-container">
    <a-page-header
      :title="t('operations.students.addStudent.title')"
      @back="() => $router.go(-1)"
    />

    <a-steps
      :current="currentStep"
      size="small"
      class="steps-header"
    >
      <a-step
        v-for="(s, i) in steps"
        :key="i"
        :title="t(s.title)"
      />
    </a-steps>

    <a-form
      ref="studentFormRef"
      layout="vertical"
      :model="form"
      @finish="handleSubmit"
    >
      <!-- Step Content -->
      <component
        :is="currentComponent"
        v-model:form="form"
        :rules="rules"
      />

      <!-- Navigation -->
      <div class="form-footer">
        <a-button
          v-if="currentStep > 0"
          @click="prevStep"
        >
          {{ t('common.previous') }}
        </a-button>

        <a-button
          v-if="currentStep < steps.length - 1"
          type="primary"
          @click="nextStep"
        >
          {{ t('common.next') }}
        </a-button>

        <a-button
          v-if="currentStep === steps.length - 1"
          type="primary"
          html-type="submit"
          :loading="loading"
        >
          {{ t('common.submit') }}
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

// Step components
import StudentInfoStep from '@/components/Students/StudentInfoStep.vue'
import GuardianInfoStep from '@/components/Students/GuardianInfoStep.vue'
import PaymentInfoStep from '@/components/Students/PaymentInfoStep.vue'
import AdditionalInfoStep from '@/components/Students/AdditionalInfoStep.vue'

const { t } = useI18n()
const steps = [
  { title: 'students.steps.studentInfo', component: StudentInfoStep },
  { title: 'students.steps.guardianInfo', component: GuardianInfoStep },
  { title: 'students.steps.paymentInfo', component: PaymentInfoStep },
  { title: 'students.steps.additionalInfo', component: AdditionalInfoStep },
]

const currentStep = ref(0)
const studentFormRef = ref()
const loading = ref(false)

const form = ref({
  // Student
  firstName: '',
  lastName: '',
  dateOfBirthday: null as Date | null,
  gender: '',
  address: '',
  // Guardian
  guardians: [
    {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      relation: '',
      address: '',
      isPrimary: false,
    },
  ],
  // Payment
  tuitionPlan: '',
  initialPayment: null as number | null,
  paymentMethod: '',
  // Additional
  previousSchool: '',
  medicalConditions: '',
  notes: '',
})

const rules = {} // each step defines its own local rules

const currentComponent = computed(() => steps[currentStep.value].component)

const nextStep = async () => {
  // could validate step-specific fields before moving
  currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const handleSubmit = async () => {
  try {
    loading.value = true
    console.log('Submitting:', form.value)
    // TODO: send to backend
    message.success(t('students.studentAdded'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-student-container {
  max-width: 50vw;
  margin: auto;
  padding: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}

.steps-header {
  margin-bottom: 24px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}
</style>
