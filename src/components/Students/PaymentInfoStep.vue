<template>
  <div>
    <!-- Tuition Plan -->
    <a-form-item
      :label="tf('tuitionPlan')"
      name="tuitionPlan"
      :rules="[{ required: true, message: t('common.select') }]"
    >
      <a-select
        v-model:value="form.tuitionPlan"
        :placeholder="t('common.select')"
      >
        <a-select-option value="monthly">
          {{ tf('plans.monthly') }}
        </a-select-option>
        <a-select-option value="term">
          {{ tf('plans.term') }}
        </a-select-option>
        <a-select-option value="yearly">
          {{ tf('plans.yearly') }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <!-- Initial Payment -->
    <a-form-item
      :label="tf('initialPayment')"
      name="initialPayment"
      :rules="[{ required: true, message: t('common.required') }]"
    >
      <a-input-number
        v-model:value="form.initialPayment"
        style="width: 100%"
        :placeholder="t('common.enterAmount')"
      />
    </a-form-item>

    <!-- Payment Method -->
    <a-form-item
      :label="tf('paymentMethod')"
      name="paymentMethod"
      :rules="[{ required: true, message: t('common.select') }]"
    >
      <a-select
        v-model:value="form.paymentMethod"
        :placeholder="t('common.select')"
      >
        <a-select-option value="cash">
          {{ tf('methods.cash') }}
        </a-select-option>
        <a-select-option value="card">
          {{ tf('methods.card') }}
        </a-select-option>
        <a-select-option value="transfer">
          {{ tf('methods.transfer') }}
        </a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// Short translation helper for local form scope
const tf = (key: string) => t(`operations.students.addStudent.form.${key}`)

defineProps<{ form: any }>()
</script>
