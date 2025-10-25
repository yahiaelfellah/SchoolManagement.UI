<template>
  <div>
    <a-form-item
      label="Tuition Plan"
      name="tuitionPlan"
      :rules="[{ required: true, message: 'Select plan' }]"
    >
      <a-select
        v-model:value="form.tuitionPlan"
        :placeholder="t('common.select')"
      >
        <a-select-option value="monthly">
          Monthly
        </a-select-option>
        <a-select-option value="term">
          Per Term
        </a-select-option>
        <a-select-option value="yearly">
          Yearly
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="Initial Payment"
      name="initialPayment"
      :rules="[{ required: true, message: t('common.select') }]"
    >
      <a-input-number
        v-model:value="form.initialPayment"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item
      label="Payment Method"
      name="paymentMethod"
      :rules="[{ required: true, message: t('common.select') }]"
    >
      <a-select v-model:value="form.paymentMethod">
        <a-select-option value="cash">
          Cash
        </a-select-option>
        <a-select-option value="card">
          Card
        </a-select-option>
        <a-select-option value="transfer">
          Bank Transfer
        </a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineProps<{ form: any }>()
</script>
