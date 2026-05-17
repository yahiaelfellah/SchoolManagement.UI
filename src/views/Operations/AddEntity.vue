<template>
  <div class="add-entity-container">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
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
        :title="tl(s.title)"
      />
    </a-steps>

    <a-form
      ref="formRef"
      layout="vertical"
      :model="form"
      @finish="handleSubmit"
    >
      <!-- Step content -->
      <component
        :is="currentComponent"
        :key="currentStep"
        :form="form"
        :rules="rules"
        @update:form="(val:any) => (form.value = val)"
      />

      <!-- Footer navigation -->
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
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'

// Steps for each entity type
import StudentInfoStep from '@/components/Students/StudentInfoStep.vue'
import GuardianInfoStep from '@/components/Students/GuardianInfoStep.vue'
import PaymentInfoStep from '@/components/Students/PaymentInfoStep.vue'
import AdditionalInfoStep from '@/components/Students/AdditionalInfoStep.vue'

import TeacherInfoStep from '@/components/Teachers/TeacherInfoStep.vue'
import TeacherEmploymentStep from '@/components/Teachers/TeacherEmploymentStep.vue'

import ClassInfoStep from '@/components/Classes/ClassInfoStep.vue'
import ClassScheduleStep from '@/components/Classes/ClassScheduleStep.vue'

// Get entity type from route (students / teachers / classes)
const route = useRoute()
const entityType = (route.params.type as 'students' | 'teachers' | 'classes') || 'students'
const { t, tl } = useLocalI18n(`operations.${entityType}.add`)

const currentStep = ref(0)
const loading = ref(false)
const formRef = ref()

// Entity-specific step configuration
const stepsByEntity: Record<string, any[]> = {
  students: [
    { title: 'steps.studentInfo', component: StudentInfoStep },
    { title: 'steps.guardianInfo', component: GuardianInfoStep },
    { title: 'steps.paymentInfo', component: PaymentInfoStep },
    { title: 'steps.additionalInfo', component: AdditionalInfoStep },
  ],
  teachers: [
    { title: 'steps.personalInfo', component: TeacherInfoStep },
    { title: 'steps.employmentInfo', component: TeacherEmploymentStep },
  ],
  classes: [
    { title: 'steps.classInfo', component: ClassInfoStep },
    { title: 'steps.schedule', component: ClassScheduleStep },
  ],
}

const steps = stepsByEntity[entityType]
const currentComponent = computed(() => steps[currentStep.value].component)

const form = ref<any>({})
const rules = ref({})

const nextStep = async () => {
  // validate current step if necessary
  currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

const handleSubmit = async () => {
  try {
    loading.value = true
    console.log(`Submitting ${entityType}`, form.value)
    // TODO: API call here
    message.success(t('common.success'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-entity-container {
  max-width: 50vw;
  margin: auto;
  padding: 20px;
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
