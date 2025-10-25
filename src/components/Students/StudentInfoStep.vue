<template>
  <div>
    <a-form-item
      :label="tf('firstName')"
      name="firstName"
      :rules="[{ required: true, message: 'Please enter first name' }]"
    >
      <a-input v-model:value="form.firstName" />
    </a-form-item>

    <a-form-item
      :label="tf('lastName')"
      name="lastName"
      :rules="[{ required: true, message: 'Please enter last name' }]"
    >
      <a-input v-model:value="form.lastName" />
    </a-form-item>

    <a-form-item
      :label="tf('dateOfBirth')"
      name="dateOfBirthday"
      :rules="[{ required: true, message: 'Please select date' }]"
    >
      <a-date-picker
        v-model:value="form.dateOfBirthday"
        style="width: 100%"
        :placeholder="t('common.select')"
      />
    </a-form-item>

    <a-form-item
      :label="tf('gender')"
      name="gender"
      :rules="[{ required: true, message: 'Please select gender' }]"
    >
      <a-select
        v-model:value="form.gender"
        :placeholder="t('common.select')"
      >
        <a-select-option value="Male">
          Male
        </a-select-option>
        <a-select-option value="Female">
          Female
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      :label="tf('address')"
      name="address"
    >
      <a-input v-model:value="form.address" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tf = (key: string) => t(`operations.students.addStudent.form.${key}`)

defineProps<{ form: any }>()
</script>
