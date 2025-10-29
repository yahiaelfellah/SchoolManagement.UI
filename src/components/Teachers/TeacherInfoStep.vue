<template>
  <div>
    <a-form-item
      :label="tl('form.firstName')"
      name="firstName"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-input v-model:value="form.firstName" :placeholder="t('common.enterName')" />
    </a-form-item>

    <a-form-item
      :label="tl('form.lastName')"
      name="lastName"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-input v-model:value="form.lastName" :placeholder="t('common.enterName')" />
    </a-form-item>

    <a-form-item
      :label="tl('form.gender')"
      name="gender"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-select v-model:value="form.gender" :placeholder="t('common.select')">
        <a-select-option value="male">{{ t('common.male') }}</a-select-option>
        <a-select-option value="female">{{ t('common.female') }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item :label="tl('form.dateOfBirth')" name="dateOfBirth">
      <a-date-picker v-model:value="form.dateOfBirth" style="width: 100%" />
    </a-form-item>

    <a-form-item
      :label="tl('form.email')"
      name="email"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-input v-model:value="form.email" type="email" :placeholder="t('common.enterEmail')" />
    </a-form-item>

    <a-form-item
      :label="tl('form.phoneNumber')"
      name="phoneNumber"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-input v-model:value="form.phoneNumber" :placeholder="t('common.enterPhone')" />
    </a-form-item>

    <a-form-item :label="tl('form.address')" name="address">
      <a-input v-model:value="form.address" :placeholder="t('common.enterAddress')" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { useLocalI18n } from '@/helpers/useLocalI18n'

const { t, tl } = useLocalI18n('operations.teachers.add')
defineProps<{ form: any }>()
</script>
