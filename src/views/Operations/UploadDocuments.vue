<template>
  <div class="upload-documents">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card :title="tl('title')">
      <a-form
        ref="formRef"
        layout="vertical"
        :model="form"
        :rules="rules"
        @finish="handleSubmit"
      >
        <!-- Entity Selection -->
        <a-form-item
          :label="tl('form.selectLabel')"
          name="entityId"
        >
          <a-select
            v-model:value="form.entityId"
            :placeholder="tl('form.selectPlaceholder')"
            show-search
            :filter-option="false"
            :not-found-content="loadingEntities ? t('common.loading') : t('common.noResults')"
            @search="handleSearch"
          >
            <a-select-option
              v-for="item in filteredList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.firstName }} {{ item.lastName }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Upload Section -->
        <a-form-item
          :label="t('common.documents')"
          name="documents"
        >
          <a-upload
            v-model:file-list="form.documents"
            list-type="picture"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            :multiple="true"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          >
            <a-button :icon="h(UploadOutlined)">
              {{ t('common.uploadFiles') }}
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
          >
            {{ t('common.submit') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- File Preview Modal -->
    <a-modal
      v-model:open="previewVisible"
      :title="previewTitle"
      footer="null"
    >
      <img
        v-if="previewImage"
        :src="previewImage"
        alt="Preview"
        style="width: 100%"
      >
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { useRoute } from 'vue-router'
import { UploadOutlined } from '@ant-design/icons-vue'
import { message, Upload } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import type UploadFile from '@/model/uploadFile'
import type Entity from '@/model/entity'





const route = useRoute()
const entityType = (route.params.type as 'students' | 'teachers') || 'students'

// Scoped i18n: automatic translation prefix
const { t, tl } = useLocalI18n(`operations.${entityType}.uploadDocuments`)

// UI State
const loading = ref(false)
const loadingEntities = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')
const formRef = ref()

// Form model
const form = ref({
  entityId: null as number | null,
  documents: [] as UploadFile[],
})

// Validation rules
const rules = {
  entityId: [
    { required: true, message: t('common.validations.required'), trigger: 'change' },
  ],
  documents: [
    { required: true, message: t('common.validations.required'), trigger: 'change' },
  ],
}

// Mock entity data
const entities = ref<Entity[]>([])
const filteredList = ref<Entity[]>([])

onMounted(async () => {
  loadingEntities.value = true
  await new Promise(r => setTimeout(r, 300))

  entities.value =
    entityType === 'teachers'
      ? [
          { id: 1, firstName: 'Mohammed', lastName: 'Saleh' },
          { id: 2, firstName: 'Layla', lastName: 'Omar' },
        ]
      : [
          { id: 1, firstName: 'Ali', lastName: 'Ahmed' },
          { id: 2, firstName: 'Sara', lastName: 'Mohamed' },
        ]

  filteredList.value = [...entities.value]
  loadingEntities.value = false
})

// Search entities
const handleSearch = async (query: string) => {
  loadingEntities.value = true
  await new Promise(r => setTimeout(r, 250))
  const lower = query.toLowerCase()
  filteredList.value = entities.value.filter(
    e => `${e.firstName} ${e.lastName}`.toLowerCase().includes(lower)
  )
  loadingEntities.value = false
}

// Upload validation
const beforeUpload = (file: File) => {
  const isAllowed =
    file.type.startsWith('image/') ||
    file.type === 'application/pdf' ||
    file.type.includes('word')

  if (!isAllowed) {
    message.error(t('common.invalidFileType'))
  }
  return isAllowed || Upload.LIST_IGNORE
}

// Upload actions
const handleRemove = (file: UploadFile) => {
  form.value.documents = form.value.documents.filter(f => f.uid !== file.uid)
}

const handlePreview = (file: UploadFile) => {
  previewVisible.value = true
  previewTitle.value = file.name
  previewImage.value =
    file.url || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : '')
}

// Submit handler
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    const formData = new FormData()
    formData.append('entityId', String(form.value.entityId))
    form.value.documents.forEach(file => {
      if (file.originFileObj) formData.append('files', file.originFileObj)
    })

    // Mock API
    console.log(`Uploading documents for ${entityType}`, Object.fromEntries(formData.entries()))
    message.success(t('common.success'))
  } catch (error) {
    console.warn('Validation failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.upload-documents {
  max-width: 50vw;
  margin: auto;
  padding: 20px;
}
</style>
