<template>
  <div>
    <a-form-item
      :label="tl('form.resume')"
      name="resume"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-upload
        v-model:file-list="form.resume"
        :before-upload="() => false"
        accept=".pdf,.doc,.docx"
      >
        <a-button>{{ t('common.uploadFile') }}</a-button>
      </a-upload>
    </a-form-item>

    <a-form-item
      :label="tl('form.certificates')"
      name="certificates"
      :rules="[{ required: true, message: t('common.validations.required') }]"
    >
      <a-upload
        v-model:file-list="form.certificates"
        :before-upload="() => false"
        multiple
        accept=".pdf,.jpg,.png"
      >
        <a-button>{{ t('common.uploadFiles') }}</a-button>
      </a-upload>
    </a-form-item>

    <a-form-item
      :label="tl('form.notes')"
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
import { useLocalI18n } from '@/helpers/useLocalI18n'
const { t, tl } = useLocalI18n('operations.teachers.add')
defineProps<{ form: any }>()
</script>
