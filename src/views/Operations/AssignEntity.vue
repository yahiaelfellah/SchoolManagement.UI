<template>
  <div class="assign-entity">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card>
      <a-form
        ref="assignFormRef"
        layout="vertical"
        :model="form"
        @finish="handleSubmit"
      >
        <!-- Source Entity -->
        <a-form-item
          :label="tl('form.source')"
          name="sourceId"
          :rules="[{ required: true, message: t('common.validations.required') }]"
        >
          <a-select
            v-model:value="form.sourceId"
            :placeholder="tl('form.selectSource')"
            show-search
            :filter-option="false"
            :not-found-content="loadingSource ? t('common.loading') : t('common.noResults')"
            @search="handleSearchSource"
          >
            <a-select-option
              v-for="item in filteredSourceList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Target Entity -->
        <a-form-item
          :label="tl('form.target')"
          name="targetIds"
          :rules="[{ required: true, message: t('common.validations.required') }]"
        >
          <a-select
            v-model:value="form.targetIds"
            :placeholder="tl('form.selectTarget')"
            mode="multiple"
            show-search
            :filter-option="false"
            :not-found-content="loadingTarget ? t('common.loading') : t('common.noResults')"
            @search="handleSearchTarget"
          >
            <a-select-option
              v-for="item in filteredTargetList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'

interface Entity {
  id: number
  name: string
}

const route = useRoute()
const assignType = (route.params.type as 'teachers' | 'subjects') || 'teachers'
const { t, tl } = useLocalI18n(`operations.teachers.assign${assignType === 'teachers' ? 'Teacher' : 'Subjects'}`)

const loading = ref(false)
const loadingSource = ref(false)
const loadingTarget = ref(false)

const assignFormRef = ref()

const form = ref({
  sourceId: null as number | null,
  targetIds: [] as number[],
})

const sourceList = ref<Entity[]>([])
const targetList = ref<Entity[]>([])
const filteredSourceList = ref<Entity[]>([])
const filteredTargetList = ref<Entity[]>([])

onMounted(async () => {
  await loadEntities()
})

const loadEntities = async () => {
  loadingSource.value = loadingTarget.value = true
  await new Promise(r => setTimeout(r, 400))

  if (assignType === 'teachers') {
    sourceList.value = [
      { id: 1, name: 'Grade 1' },
      { id: 2, name: 'Grade 2' },
    ]
    targetList.value = [
      { id: 1, name: 'Mr. Ali Ahmed' },
      { id: 2, name: 'Ms. Sara Mohamed' },
    ]
  } else {
    sourceList.value = [
      { id: 1, name: 'Mr. Ali Ahmed' },
      { id: 2, name: 'Ms. Sara Mohamed' },
    ]
    targetList.value = [
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'Science' },
      { id: 3, name: 'English' },
    ]
  }

  filteredSourceList.value = [...sourceList.value]
  filteredTargetList.value = [...targetList.value]
  loadingSource.value = loadingTarget.value = false
}

const handleSearchSource = async (query: string) => {
  loadingSource.value = true
  await new Promise(r => setTimeout(r, 200))
  const lower = query.toLowerCase()
  filteredSourceList.value = sourceList.value.filter(s => s.name.toLowerCase().includes(lower))
  loadingSource.value = false
}

const handleSearchTarget = async (query: string) => {
  loadingTarget.value = true
  await new Promise(r => setTimeout(r, 200))
  const lower = query.toLowerCase()
  filteredTargetList.value = targetList.value.filter(t => t.name.toLowerCase().includes(lower))
  loadingTarget.value = false
}

const handleSubmit = async () => {
  try {
    await assignFormRef.value?.validate()
    loading.value = true
    console.log(`✅ Submitting ${assignType}`, form.value)
    message.success(t('common.success'))
  } catch (err) {
    console.warn('❌ Validation failed:', err)
    message.error(t('common.validations.required'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.assign-entity {
  max-width: 50vw;
  margin: auto;
  padding: 20px;
}
</style>
