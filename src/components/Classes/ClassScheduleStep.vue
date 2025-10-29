<template>
  <div>
    <a-form-item
      :label="tl('form.startDate')"
      name="startDate"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-date-picker v-model:value="form.startDate" style="width: 100%" />
    </a-form-item>

    <a-form-item
      :label="tl('form.endDate')"
      name="endDate"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-date-picker v-model:value="form.endDate" style="width: 100%" />
    </a-form-item>

    <a-form-item
      :label="tl('form.daysOfWeek')"
      name="daysOfWeek"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-select
        v-model:value="form.daysOfWeek"
        mode="multiple"
        :placeholder="t('common.selectDays')"
      >
        <a-select-option value="sunday">{{ t('common.days.sunday') }}</a-select-option>
        <a-select-option value="monday">{{ t('common.days.monday') }}</a-select-option>
        <a-select-option value="tuesday">{{ t('common.days.tuesday') }}</a-select-option>
        <a-select-option value="wednesday">{{ t('common.days.wednesday') }}</a-select-option>
        <a-select-option value="thursday">{{ t('common.days.thursday') }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      :label="tl('form.startTime')"
      name="startTime"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-time-picker v-model:value="form.startTime" format="HH:mm" style="width: 100%" />
    </a-form-item>

    <a-form-item
      :label="tl('form.endTime')"
      name="endTime"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-time-picker v-model:value="form.endTime" format="HH:mm" style="width: 100%" />
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
import { useLocalI18n } from '@/helpers/useLocalI18n'
const { t, tl } = useLocalI18n('operations.classes.add')
defineProps<{ form: any }>()
</script>
