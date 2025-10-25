<template>
  <div>
    <a-form-item
      :label="tf('previousSchool')"
      name="previousSchool"
    >
      <a-input v-model:value="form.previousSchool" />
    </a-form-item>

    <a-form-item
      :label="tf('medicalConditions')"
      name="medicalConditions"
    >
      <a-textarea
        v-model:value="form.medicalConditions"
        rows="3"
      />
    </a-form-item>

    <a-form-item
      :label="tf('allergies')"
      name="allergies"
    >
      <a-textarea
        v-model:value="form.allergies"
        rows="2"
      />
    </a-form-item>

    <a-form-item
      :label="tf('specialNeeds')"
      name="specialNeeds"
    >
      <a-textarea
        v-model:value="form.specialNeeds"
        rows="2"
      />
    </a-form-item>

    <a-form-item
      :label="tf('emergencyContact')"
      name="emergencyContact"
    >
      <a-input
        v-model:value="form.emergencyContact"
        placeholder="+966 500 000 000"
      />
    </a-form-item>

    <a-form-item
      :label="tf('additionalNotes')"
      name="notes"
    >
      <a-textarea
        v-model:value="form.notes"
        rows="3"
      />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tf = (key: string) => 
        t(`operations.students.addStudent.form.${key}`)

defineProps<{ form: any }>()
</script>
