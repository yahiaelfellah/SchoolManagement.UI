<template>
  <div class="operations-container">
    <h2 class="page-title">{{ t('operations.title') }}</h2>

    <a-tabs v-model:activeKey="activeKey" :tab-position="mode" :style="{ height: '200px' }" @tabScroll="callback">
      <a-tab-pane v-for="(group, groupIndex) in store.evaluatedGroups" :key="groupIndex" :tab="t(group.title)">
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
import { ref, onMounted } from 'vue'
import { type TabsProps } from 'ant-design-vue'
import OperationCard from '@/components/Operations/OperationCard.vue'
import { useOperationsStore } from '@/store/operations'
import { useDialogStore } from '@/store/operationsDialog'

const { t } = useI18n()
const activeKey = ref(0)
const mode = ref<TabsProps['tabPosition']>('top')

const store = useOperationsStore()
const dialogStore = useDialogStore();

onMounted(async () => {
  store.initializeOperations()
  await store.fetchFeatureStates()
})

const handleCardClick = (key: string) => {
  console.log(`Clicked on operation: ${key}`)
  dialogStore.openDialog(key)
}
</script>

<style scoped>
.operations-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.operation-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  border-bottom: 2px solid var(--ant-primary-color, #1677ff);
  display: inline-block;
  padding-bottom: 4px;
}

.operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.operation-card {
  text-align: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.operation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 0;
}

.card-icon {
  font-size: 34px;
  color: var(--ant-primary-color, #1677ff);
  margin-bottom: 10px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
}
</style>
