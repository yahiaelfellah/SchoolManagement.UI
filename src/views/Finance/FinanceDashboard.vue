<template>
  <div class="finance-dashboard">
    <a-page-header
      title="Finance Dashboard"
    />

    <a-row :gutter="[16, 16]">
      <a-col
        v-for="op in operations[0]?.items || []"
        :key="op.key"
        :xs="24"
        :sm="12"
        :md="6"
      >
        <OperationCard 
        :op="op" 
        :click="handleCardClick(op.key)"
        />
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]">
      <!-- Stats Cards -->
      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic
            title="Total Collected (This Month)"
            :value="dashboardStats?.totalCollectedThisMonth || 0"
            :precision="0"
            suffix="TND"
          />
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic
            title="Outstanding Balance"
            :value="dashboardStats?.outstandingBalance || 0"
            :precision="0"
            suffix="TND"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic
            title="Overdue Payments"
            :value="dashboardStats?.overdueCount || 0"
            :value-style="{ color: '#ff4d4f' }"
          />
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <a-card>
          <a-statistic
            title="Partial Payments"
            :value="dashboardStats?.partialPaymentCount || 0"
            :value-style="{ color: '#faad14' }"
          />
        </a-card>
      </a-col>

      <!-- Revenue Graph -->
      <a-col :xs="24" :md="16">
        <a-card title="Revenue Trend (Last 6 Months)">
          <div class="revenue-chart">
            <div v-if="dashboardStats?.revenueData && dashboardStats.revenueData.length > 0" class="chart-container">
              <div class="chart-bars">
                <div
                  v-for="(data, index) in dashboardStats.revenueData"
                  :key="index"
                  class="chart-bar-wrapper"
                >
                  <div class="chart-bar-container">
                    <div
                      class="chart-bar"
                      :style="{ height: `${getBarHeight(data.amount)}%` }"
                      :title="`${formatMonth(data.month)}: ${data.amount.toLocaleString()} TND`"
                    >
                      <span class="bar-value">{{ data.amount > 0 ? data.amount.toLocaleString() : '' }}</span>
                    </div>
                  </div>
                  <div class="bar-label">{{ formatMonthShort(data.month) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="chart-placeholder">
              <p class="text-gray-500">No revenue data available</p>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- Overdue Students List -->
      <a-col :xs="24" :md="8">
        <a-card title="Overdue Students">
          <a-list
            :data-source="overdueStudents"
            :loading="loading"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    Student {{ item.studentId }}
                  </template>
                  <template #description>
                    <div>
                      <div>Amount: {{ item.overdueAmount.toLocaleString() }} TND</div>
                      <div>Months: {{ item.overdueMonths.length }}</div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- Popular Services -->
      <a-col :xs="24" :md="12">
        <a-card title="Popular Services">
          <a-list
            :data-source="dashboardStats?.popularServices || []"
            :loading="loading"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    {{ item.serviceName }}
                  </template>
                  <template #description>
                    <div>
                      <div>Students: {{ item.studentCount }}</div>
                      <div>Revenue: {{ item.totalRevenue.toLocaleString() }} TND</div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- Payment Methods Stats -->
      <a-col :xs="24" :md="12">
        <a-card title="Payment Methods Statistics">
          <a-list
            :data-source="dashboardStats?.paymentMethodsStats || []"
            :loading="loading"
            size="small"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    {{ item.method.toUpperCase() }}
                  </template>
                  <template #description>
                    <div>
                      <div>Count: {{ item.count }}</div>
                      <div>Total: {{ item.totalAmount.toLocaleString() }} TND ({{ item.percentage }}%)</div>
                    </div>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <!-- Navigation Cards -->

    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useFinanceStore } from '@/stores/financeStore'
import dayjs from 'dayjs'
import { useOperationsStore } from '@/stores/operations'
import OperationCard from '@/components/Operations/OperationCard.vue'


const financeStore = useFinanceStore()
const operationStore = useOperationsStore()

const dashboardStats = computed(() => financeStore.dashboardStats)
const loading = computed(() => financeStore.loading)
const overdueStudents = computed(() => financeStore.overdueStudents)
const operations = computed(() => operationStore.fetchOperationsGroups('finance'))

onMounted(async () => {
  // Fetch all necessary data first
  await financeStore.fetchPaymentLedgers()
  await financeStore.fetchPayments()
  await financeStore.fetchServices()
  await financeStore.fetchDashboardStats()
})

const maxRevenue = computed(() => {
  if (!dashboardStats.value?.revenueData || dashboardStats.value.revenueData.length === 0) {
    return 1
  }
  return Math.max(...dashboardStats.value.revenueData.map(d => d.amount), 1)
})

const getBarHeight = (amount: number) => {
  if (maxRevenue.value === 0) return 0
  return Math.max((amount / maxRevenue.value) * 100, 5) // Minimum 5% height for visibility
}

const handleCardClick = (key: string) => {
  operationStore.navigateToOperation(key)
}
const formatMonth = (month: string) => {
  return dayjs(`${month}-01`).format('MMMM YYYY')
}

const formatMonthShort = (month: string) => {
  return dayjs(`${month}-01`).format('MMM YY')
}
</script>

<style scoped>
.finance-dashboard {
  padding: 20px;
}

.revenue-chart {
  height: 300px;
  padding: 20px 0;
}

.chart-container {
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  gap: 10px;
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  max-width: 120px;
}

.chart-bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
}

.chart-bar {
  width: 100%;
  background: linear-gradient(to top, #1890ff, #40a9ff);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  background: linear-gradient(to top, #096dd9, #1890ff);
  opacity: 0.9;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.bar-label {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
  font-weight: 500;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-gray-500 {
  color: #888;
}

.navigation-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.navigation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.navigation-card :deep(.ant-card-body) {
  min-height: 120px;
}

/* optional: existing .operations-grid kept for reference but no longer used by the template */
.operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
  margin-top: 12px;
}
</style>

