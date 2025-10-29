<template>
  <div>
    <a-form-item
      :label="tl('form.className')"
      name="className"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-input v-model:value="form.className" :placeholder="t('common.enterClassName')" />
    </a-form-item>

    <a-form-item
      :label="tl('form.gradeLevel')"
      name="gradeLevel"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-select v-model:value="form.gradeLevel" :placeholder="t('common.selectGrade')">
        <a-select-option value="1">1</a-select-option>
        <a-select-option value="2">2</a-select-option>
        <a-select-option value="3">3</a-select-option>
        <a-select-option value="4">4</a-select-option>
        <a-select-option value="5">5</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      :label="tl('form.homeroomTeacher')"
      name="homeroomTeacher"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-select v-model:value="form.homeroomTeacher" show-search :placeholder="t('common.selectTeacher')">
        <a-select-option value="1">Ali Ahmed</a-select-option>
        <a-select-option value="2">Layla Omar</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item :label="tl('form.description')" name="description">
      <a-textarea v-model:value="form.description" rows="3" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { useLocalI18n } from '@/helpers/useLocalI18n'
const { t, tl } = useLocalI18n('operations.classes.add')
defineProps<{ form: any }>()
</script>
