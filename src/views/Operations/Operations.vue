<template>
  <div class="operations-container">
    <Filter
      :filters="filters"
      @search="onSearch"
      @reset="onReset"
    />

    <a-tabs
      v-model:active-key="activeKey"
      :tab-position="mode"
      class="operations-tabs"
    >
      <a-tab-pane
        v-for="(group, groupIndex) in filteredGroups"
        :key="groupIndex"
        :tab="t(group.title)"
      >
        <div class="operations-grid">
          <OperationCard
            v-for="op in group.items"
            :key="op.key"
            :op="op"
            @click="handleCardClick"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed } from 'vue'
import { type TabsProps } from 'ant-design-vue'
import OperationCard from '@/components/Operations/OperationCard.vue'
import { useOperationsStore } from '@/stores/operations'
import Filter from '@/components/Filter.vue'

const { t } = useI18n()
const activeKey = ref(0)
const mode = ref<TabsProps['tabPosition']>('top')

const store = useOperationsStore()

onMounted(async () => {
  store.initializeOperations()
  await store.fetchFeatureStates()
})

// local filters + computed filteredGroups + handlers
const filters = ref({ query: '' } as Record<string, string>)

const filteredGroups = computed(() => {
  const q = (filters.value.query || '').toString().trim().toLowerCase()
  if (!q) return store.evaluatedGroups

  return store.evaluatedGroups
    .map(group => ({
      ...group,
      items: (group.items || []).filter((op: any) => {
        const title = (t(op.title) || op.title || '').toString().toLowerCase()
        return title.includes(q)
      })
    }))
    .filter((g: any) => Array.isArray(g.items) && g.items.length > 0)
})

const onSearch = (payload: Record<string, string>) => {
  filters.value.query = (payload.query ?? '').toString()
}

const onReset = () => {
  filters.value.query = ''
}

const handleCardClick = (key: string) => {
  store.navigateToOperation(key)
}
</script>

<style scoped>
.operations-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* header */
.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: var(--ant-primary-color, #0d47a1);
}

/* filter card */
.filter-wrapper {
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}
.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.filter-icon {
  font-size: 16px;
  color: var(--ant-primary-color, #0d47a1);
}

/* tabs */
.operations-tabs >>> .ant-tabs-nav {
  margin-bottom: 8px;
}

/* grid and cards */
.operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
  margin-top: 12px;
}

/* fallback styles if OperationCard does not style itself */
.operation-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform .18s ease, box-shadow .18s ease;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(3, 0, 71, 0.04);
}
.operation-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(3, 0, 71, 0.08);
}

.card-icon {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(13,71,161,0.08), rgba(13,71,161,0.02));
  font-size: 24px;
  color: var(--ant-primary-color, #0d47a1);
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
</style>
