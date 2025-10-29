<template>
  <div class="delete-archive">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card>
      <a-form layout="vertical" @finish="handleSubmit">
        <!-- Entity Selection -->
        <a-form-item
          :label="tl('form.selectLabel')"
          name="entityId"
          :rules="[{ required: true, message: t('validations.required') }]"
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

        <!-- Action Type -->
        <a-form-item
          :label="tl('form.actionType')"
          name="action"
          :rules="[{ required: true, message: t('validations.required') }]"
        >
          <a-radio-group v-model:value="form.action">
            <a-radio value="archive">{{ tl('actions.archive') }}</a-radio>
            <a-radio value="delete">{{ tl('actions.delete') }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- Notes (optional) -->
        <a-form-item :label="tl('form.reason')" name="reason">
          <a-textarea
            v-model:value="form.reason"
            :placeholder="tl('form.reasonPlaceholder')"
            rows="3"
          />
        </a-form-item>

        <a-form-item>
          <a-popconfirm
            :title="confirmMessage"
            :ok-text="t('common.confirm')"
            :cancel-text="t('common.cancel')"
            @confirm="handleSubmit"
          >
            <a-button
              type="primary"
              :danger="form.action === 'delete'"
              :loading="loading"
            >
              {{ form.action === 'delete' ? tl('actions.delete') : tl('actions.archive') }}
            </a-button>
          </a-popconfirm>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import type Entity from '@/model/entity'


const route = useRoute()
const entityType = (route.params.type as 'students' | 'teachers') || 'students'

// Scoped i18n helper
const { t, tl } = useLocalI18n(`operations.deleteOrArchive`)

const loading = ref(false)
const loadingEntities = ref(false)

const form = ref({
  entityId: null as number | null,
  action: 'archive' as 'archive' | 'delete',
  reason: '',
})

const entities = ref<Entity[]>([])
const filteredList = ref<Entity[]>([])

// Load mock data
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

// Search handler
const handleSearch = async (query: string) => {
  loadingEntities.value = true
  await new Promise(r => setTimeout(r, 250))
  const lower = query.toLowerCase()
  filteredList.value = entities.value.filter(e =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(lower)
  )
  loadingEntities.value = false
}

// Confirm message
const confirmMessage = computed(() =>
  form.value.action === 'delete'
    ? tl('confirm.delete')
    : tl('confirm.archive')
)

// Submit
const handleSubmit = async () => {
  if (!form.value.entityId) {
    message?.error(t('validations.required'))
    return
  }

  loading.value = true
  await new Promise(r => setTimeout(r, 500)) // simulate API call

  if (form.value.action === 'delete') {
    message?.success(tl('success.delete'))
  } else {
    message?.success(tl('success.archive'))
  }

  loading.value = false
}
</script>

<style scoped>
.delete-archive {
  max-width: 50vw;
  margin: auto;
  padding: 20px;
}
</style>
