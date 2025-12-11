<template>
  <div class="services-page">
    <a-page-header
      title="Services Management"
      sub-title="Manage student services (Transport, Lunch, Books, etc.)"
      @back="() => $router.push({ name: 'Finance' })"
    />

    <a-card>
      <template #extra>
        <a-button type="primary" @click="showModal = true">
          <template #icon><PlusOutlined /></template>
          Add Service
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="services"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'cost'">
            {{ record.cost.toLocaleString() }} TND
          </template>
          <template v-else-if="column.key === 'recurring'">
            <a-tag :color="record.recurring ? 'blue' : 'default'">
              {{ record.recurring ? 'Yes' : 'No' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'discountAllowed'">
            <a-tag :color="record.discountAllowed ? 'green' : 'default'">
              {{ record.discountAllowed ? 'Yes' : 'No' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button size="small" @click="handleEdit(record)">
                <template #icon><EditOutlined /></template>
                Edit
              </a-button>
              <a-button size="small" danger @click="handleDelete(record.id)">
                <template #icon><DeleteOutlined /></template>
                Delete
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add/Edit Modal -->
    <a-modal
      v-model:open="showModal"
      :title="editingService ? 'Edit Service' : 'Create Service'"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item label="Service Name" required>
          <a-input v-model:value="form.name" placeholder="e.g., Transport, Lunch" />
        </a-form-item>

        <a-form-item label="Cost (TND)" required>
          <a-input-number
            v-model:value="form.cost"
            :min="0"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="Description">
          <a-textarea
            v-model:value="form.description"
            :rows="3"
            placeholder="Service description"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="form.recurring">
            Recurring service (added monthly)
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="form.discountAllowed">
            Discount allowed
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useFinanceStore } from '@/stores/financeStore'
import type { Service } from '@/model/service'

const router = useRouter()
const financeStore = useFinanceStore()
const { services, loading } = financeStore

const showModal = ref(false)
const editingService = ref<Service | null>(null)

const form = ref({
  name: '',
  cost: 0,
  recurring: false,
  discountAllowed: false,
  description: ''
})

const columns = [
  { title: 'Service Name', dataIndex: 'name', key: 'name' },
  { title: 'Cost', key: 'cost' },
  { title: 'Recurring', key: 'recurring' },
  { title: 'Discount Allowed', key: 'discountAllowed' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Actions', key: 'actions' }
]

const handleEdit = (service: Service) => {
  editingService.value = service
  form.value = {
    name: service.name,
    cost: service.cost,
    recurring: service.recurring,
    discountAllowed: service.discountAllowed,
    description: service.description || ''
  }
  showModal.value = true
}

const handleDelete = async (id: string) => {
  try {
    await financeStore.deleteService(id)
    message.success('Service deleted successfully')
  } catch (error) {
    message.error('Failed to delete service')
  }
}

const handleSubmit = async () => {
  if (!form.value.name || !form.value.cost) {
    message.error('Please fill all required fields')
    return
  }

  try {
    if (editingService.value) {
      await financeStore.updateService(editingService.value.id, form.value)
      message.success('Service updated successfully')
    } else {
      await financeStore.createService(form.value)
      message.success('Service created successfully')
    }
    handleCancel()
  } catch (error) {
    message.error('Failed to save service')
  }
}

const handleCancel = () => {
  showModal.value = false
  editingService.value = null
  form.value = {
    name: '',
    cost: 0,
    recurring: false,
    discountAllowed: false,
    description: ''
  }
}

onMounted(() => {
  financeStore.fetchServices()
})
</script>

<style scoped>
.services-page {
  padding: 20px;
}
</style>

