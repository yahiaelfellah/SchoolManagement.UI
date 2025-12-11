<template>
  <div class="finance-page">
    <a-page-header title="Student Finance & Payment Module" />
    
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          hoverable
          @click="navigateTo('dashboard')"
          class="finance-card"
        >
          <template #title>
            <DashboardOutlined /> Dashboard
          </template>
          <p>View financial overview and statistics</p>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          hoverable
          @click="navigateTo('tuition-plans')"
          class="finance-card"
        >
          <template #title>
            <FileTextOutlined /> Tuition Plans
          </template>
          <p>Manage tuition plans and due dates</p>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          hoverable
          @click="navigateTo('payment-ledger')"
          class="finance-card"
        >
          <template #title>
            <TableOutlined /> Payment Ledger
          </template>
          <p>View monthly payment tracking</p>
        </a-card>
      </a-col>



      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          hoverable
          @click="navigateTo('services')"
          class="finance-card"
        >
          <template #title>
            <AppstoreOutlined /> Services
          </template>
          <p>Manage student services</p>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8">
        <a-card
          hoverable
          @click="navigateTo('add-payment')"
          class="finance-card"
        >
          <template #title>
            <PlusCircleOutlined /> Add Payment
          </template>
          <p>Record a new payment transaction</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  DashboardOutlined,
  FileTextOutlined,
  TableOutlined,
  AppstoreOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

const navigateTo = (route: string) => {
  router.push({ name: route })
}
</script>

<style scoped>
.finance-page {
  padding: 20px;
}

.finance-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.finance-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.finance-card :deep(.ant-card-body) {
  min-height: 120px;
}
</style>

