<template>
  <div>
    <a-form-item
      label="Previous School"
      name="previousSchool"
    >
      <a-input v-model:value="form.previousSchool" />
    </a-form-item>

    <a-form-item
      label="Medical Conditions"
      name="medicalConditions"
    >
      <a-textarea
        v-model:value="form.medicalConditions"
        rows="3"
      />
    </a-form-item>

    <a-form-item
      label="Notes"
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
defineProps<{ form: any }>()
</script>
