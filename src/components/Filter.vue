<template>
  <a-card bordered>
    <div class="filter-card">
      <!-- prominent search -->
      <a-input-search
        v-if="mainKey"
        v-model:value="localFilters[mainKey]"
        :placeholder="t('common.search')"
        enter-button
        allow-clear
        :aria-label="`filter-${mainKey}`"
        class="search-input"
        @search="onSearch"
        @input="onInput"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input-search>

      <!-- compact extra filters -->
      <div
        v-if="extraKeys.length"
        class="extra-filters"
      >
        <a-form
          :model="localFilters"
          layout="inline"
          @finish="onSearch"
        >
          <template
            v-for="key in extraKeys"
            :key="key"
          >
            <a-form-item :label="labelFor(key)">
              <a-input
                v-model:value="localFilters[key]"
                :placeholder="placeholderFor(key)"
                allow-clear
                @input="onInput"
              >
                <template #prefix>
                  <FilterOutlined />
                </template>
              </a-input>
            </a-form-item>
          </template>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
            >
              {{ t('common.search') }}
            </a-button>
            <a-button
              style="margin-left: 8px"
              @click="onReset"
            >
              {{ t('common.reset') }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
// filepath: d:\Project\SchoolManagementSystem\schoolmanagementsystem.client\src\components\Filter.vue
import { shallowReactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  filters: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'search', payload: Record<string, string>): void
  (e: 'reset'): void
}>()

const { t } = useI18n()

// local reactive copy so template binds are fast and isolated from parent reactivity
const localFilters = shallowReactive({ ...(props.filters || {}) } as Record<string, string>)

// keep localFilters in sync if parent changes filters reference/values
watch(
  () => props.filters,
  (next) => {
    if (!next) return
    // update keys/values without replacing the reactive object
    const nextKeys = Object.keys(next)
    // remove keys not present anymore
    Object.keys(localFilters).forEach(k => {
      if (!nextKeys.includes(k)) delete localFilters[k]
    })
    // set/override values
    nextKeys.forEach(k => (localFilters[k] = next[k] ?? ''))
  },
  { deep: true, immediate: true }
)

const filterKeys = computed(() => Object.keys(localFilters))
const mainKey = computed(() => filterKeys.value.length ? filterKeys.value[0] : null)
const extraKeys = computed(() => filterKeys.value.slice(1))

// debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

// emit search (debounced for typing)
const emitSearch = (payload: Record<string, string>) => emit('search', { ...payload })
const emitSearchDebounced = debounce(emitSearch, 300)

// handlers
const onSearch = () => emitSearch({ ...localFilters })

const onInput = () => {
  // auto-search but debounced
  emitSearchDebounced({ ...localFilters })
}

const onReset = () => {
  Object.keys(localFilters).forEach(k => (localFilters[k] = ''))
  emit('reset')
  emitSearch({ ...localFilters })
}

// small helpers for labels/placeholders (can be extended to use i18n keys per-field)
const labelFor = (key: string) => {
  const commonKey = `form.${key}`
  return t(commonKey) || key.charAt(0).toUpperCase() + key.slice(1)
}

const placeholderFor = (key: string) => {
  return `${t('common.search')} ${labelFor(key)}`
}
</script>

<style scoped>
.filter-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #fff;
  padding: 12px;
  border-radius: 10px;
}
.search-input {
  width: 100%;
  border-radius: 8px;
}
.extra-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
a-form-item {
  margin-bottom: 0;
}
</style>
