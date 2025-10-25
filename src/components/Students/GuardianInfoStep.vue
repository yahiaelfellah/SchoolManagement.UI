<template>
  <div>
    <a-form-item
      :label="t('operations.students.addStudent.form.guardianFirstName')"
      name="guardianFirstName"
      :rules="[{ required: true, message: 'Enter guardian first name' }]"
    >
      <a-input v-model:value="form.guardianFirstName" />
    </a-form-item>

    <a-form-item
      :label="t('operations.students.addStudent.form.guardianLastName')"
      name="guardianLastName"
      :rules="[{ required: true, message: 'Enter guardian last name' }]"
    >
      <a-input v-model:value="form.guardianLastName" />
    </a-form-item>

    <a-form-item
      :label="t('operations.students.addStudent.form.guardianPhoneNumber')"
      name="guardianPhoneNumber"
      :rules="[{ required: true, message: 'Enter phone number' }]"
    >
      <a-input v-model:value="form.guardianPhoneNumber" />
    </a-form-item>

    <a-form-item
      :label="t('operations.students.addStudent.form.guardianRelation')"
      name="guardianRelation"
    >
      <a-select
        v-model:value="form.guardianRelation"
        :placeholder="t('common.select')"
      >
        <a-select-option value="Parent">
          Parent
        </a-select-option>
        <a-select-option value="Sibling">
          Sibling
        </a-select-option>
        <a-select-option value="Other">
          Other
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
