<template>
  <div class="services-page">
    <a-page-header
      :title="tl('services.title')"
      :sub-title="tl('services.description')"
      @back="() => $router.push({ name: 'Finance' })"
    />

    <a-card>
      <template #extra>
        <a-button
          type="primary"
          @click="showModal = true"
        >
          <template #icon>
            <PlusOutlined />
          </template>
          {{ tl('services.addService') }}
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
              <a-button
                size="small"
                @click="handleEdit(record)"
              >
                <template #icon>
                  <EditOutlined />
                </template>
                {{ tl('services.editService') }}
              </a-button>
              <a-button
                size="small"
                danger
                @click="handleDelete(record.id)"
              >
                <template #icon>
                  <DeleteOutlined />
                </template>
                {{ tl('tuitionPlans.delete') }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add/Edit Modal -->
    <a-modal
      v-model:open="showModal"
      :title="editingService ? tl('services.editService') : tl('services.createService')"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form
        :model="form"
        layout="vertical"
      >
        <a-form-item
          :label="tl('services.serviceName')"
          required
        >
          <a-input
            v-model:value="form.name"
            :placeholder="tl('services.serviceName')"
          />
        </a-form-item>

        <a-form-item
          :label="`${tl('services.cost')} (TND)`"
          required
        >
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
            {{ tl('services.recurring') }}
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="form.discountAllowed">
            {{ tl('services.discountAllowed') }}
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useFinanceStore } from '@/stores/financeStore'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import type { Service } from '@/model/service'

const router = useRouter()
const financeStore = useFinanceStore()
const { tl, t } = useLocalI18n('operations.finance')
const services = computed(() => financeStore.services)
const loading = computed(() => financeStore.loading)

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
  { title: tl('services.serviceName'), dataIndex: 'name', key: 'name' },
  { title: tl('services.cost'), key: 'cost' },
  { title: tl('services.recurring'), key: 'recurring' },
  { title: tl('services.discountAllowed'), key: 'discountAllowed' },
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
    message.success(t('common.success'))
  } catch (error) {
    message.error('Error deleting service')
  }
}

const handleSubmit = async () => {
  if (!form.value.name || !form.value.cost) {
    message.error(t('common.validations.required'))
    return
  }

  try {
    if (editingService.value) {
      await financeStore.updateService(editingService.value.id, form.value)
      message.success(t('common.success'))
    } else {
      await financeStore.createService(form.value)
      message.success(t('common.success'))
    }
    handleCancel()
  } catch (error) {
    message.error('Error saving service')
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

