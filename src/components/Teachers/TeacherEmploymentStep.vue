<template>
  <div>
    <a-form-item
      :label="tl('form.department')"
      name="department"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-select
        v-model:value="form.department"
        :placeholder="t('common.select')"
      >
        <a-select-option value="math">
          {{ t('common.departments.math') }}
        </a-select-option>
        <a-select-option value="science">
          {{ t('common.departments.science') }}
        </a-select-option>
        <a-select-option value="english">
          {{ t('common.departments.english') }}
        </a-select-option>
        <a-select-option value="social">
          {{ t('common.departments.social') }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      :label="tl('form.position')"
      name="position"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-input
        v-model:value="form.position"
        :placeholder="t('common.enterPosition')"
      />
    </a-form-item>

    <a-form-item
      :label="tl('form.salary')"
      name="salary"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-input-number
        v-model:value="form.salary"
        :placeholder="t('common.enterAmount')"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item
      :label="tl('form.hireDate')"
      name="hireDate"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-date-picker
        v-model:value="form.hireDate"
        style="width: 100%"
      />
    </a-form-item>

    <a-form-item
      :label="tl('form.contractType')"
      name="contractType"
    >
      <a-select
        v-model:value="form.contractType"
        :placeholder="t('common.select')"
      >
        <a-select-option value="full">
          {{ t('common.contract.fullTime') }}
        </a-select-option>
        <a-select-option value="part">
          {{ t('common.contract.partTime') }}
        </a-select-option>
      </a-select>
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { useLocalI18n } from '@/helpers/useLocalI18n'
const { t, tl } = useLocalI18n('operations.teachers.add')
defineProps<{ form: any }>()
</script>
