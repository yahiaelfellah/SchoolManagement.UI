<template>
  <div class="tuition-plans-page">
    <a-page-header
      :title="tl('tuitionPlans.title')"
      :sub-title="tl('tuitionPlans.description')"
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
          {{ tl('tuitionPlans.addPlan') }}
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="tuitionPlans"
        :loading="loading"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            {{ record.amount.toLocaleString() }} TND
          </template>
          <template v-else-if="column.key === 'dueDates'">
            <a-tag
              v-for="(date, idx) in record.dueDates.slice(0, 3)"
              :key="idx"
            >
              {{ formatDate(date) }}
            </a-tag>
            <a-tag v-if="record.dueDates.length > 3">
              +{{ record.dueDates.length - 3 }} more
            </a-tag>
          </template>
          <template v-else-if="column.key === 'autoGenerateInvoices'">
            <a-tag :color="record.autoGenerateInvoices ? 'green' : 'default'">
              {{ record.autoGenerateInvoices ? 'Yes' : 'No' }}
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
                {{ tl('tuitionPlans.edit') }}
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
      :title="editingPlan ? tl('tuitionPlans.editPlan') : tl('tuitionPlans.createPlan')"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form
        :model="form"
        layout="vertical"
      >
        <a-form-item
          :label="tl('tuitionPlans.planName')"
          required
        >
          <a-select
            v-model:value="form.name"
            :disabled="!!editingPlan"
          >
            <a-select-option value="Monthly">
              Monthly
            </a-select-option>
            <a-select-option value="Term">
              Term
            </a-select-option>
            <a-select-option value="Yearly">
              Yearly
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="`${tl('tuitionPlans.amount')} (TND)`"
          required
        >
          <a-input-number
            v-model:value="form.amount"
            :min="0"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="form.autoGenerateInvoices">
            {{ tl('tuitionPlans.autoGenerateInvoices') }}
          </a-checkbox>
        </a-form-item>

        <a-form-item
          v-if="form.name"
          label="Start Date"
        >
          <a-date-picker
            v-model:value="startDate"
            style="width: 100%"
            format="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item v-if="form.name && startDate">
          <a-button @click="generateDates">
            {{ tl('tuitionPlans.generateDates') }}
          </a-button>
        </a-form-item>

        <a-form-item
          v-if="form.dueDates.length > 0"
          label="Generated Due Dates"
        >
          <a-tag
            v-for="(date, idx) in form.dueDates"
            :key="idx"
            style="margin: 4px"
          >
            {{ formatDate(date) }}
          </a-tag>
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
import type { TuitionPlan } from '@/model/tuitionPlan'
import dayjs, { type Dayjs } from 'dayjs'

const financeStore = useFinanceStore()
const { tl, t } = useLocalI18n('operations.finance')
const tuitionPlans = computed(() => financeStore.tuitionPlans)
const loading = computed(() => financeStore.loading)

const showModal = ref(false)
const editingPlan = ref<TuitionPlan | null>(null)
const startDate = ref<Dayjs | null>(null)

const form = ref({
  name: 'Monthly' as 'Monthly' | 'Term' | 'Yearly',
  amount: 0,
  autoGenerateInvoices: true,
  dueDates: [] as string[]
})

const columns = [
  { title: tl('tuitionPlans.planName'), dataIndex: 'name', key: 'name' },
  { title: tl('tuitionPlans.amount'), key: 'amount' },
  { title: 'Due Dates', key: 'dueDates' },
  { title: tl('tuitionPlans.autoGenerateInvoices'), key: 'autoGenerateInvoices' },
  { title: 'Actions', key: 'actions' }
]

const formatDate = (date: string) => {
  return dayjs(date).format('DD MMM YYYY')
}

const generateDates = () => {
  if (!startDate.value || !form.value.name) {
    message.warning('Please select a start date and plan name')
    return
  }
  const dates = financeStore.generateDueDates(
    form.value.name,
    startDate.value.format('YYYY-MM-DD')
  )
  form.value.dueDates = dates
  message.success(`Generated ${dates.length} due dates`)
}

const handleEdit = (plan: TuitionPlan) => {
  editingPlan.value = plan
  form.value = {
    name: plan.name,
    amount: plan.amount,
    autoGenerateInvoices: plan.autoGenerateInvoices,
    dueDates: [...plan.dueDates]
  }
  if (plan.dueDates.length > 0) {
    startDate.value = dayjs(plan.dueDates[0])
  }
  showModal.value = true
}

const handleDelete = async (id: string) => {
  try {
    await financeStore.deleteTuitionPlan(id)
    message.success(t('common.success'))
  } catch (error) {
    message.error('Error deleting plan')
  }
}

const handleSubmit = async () => {
  if (!form.value.name || !form.value.amount) {
    message.error(t('common.validations.required'))
    return
  }

  try {
    if (editingPlan.value) {
      await financeStore.updateTuitionPlan(editingPlan.value.id, form.value)
      message.success(t('common.success'))
    } else {
      await financeStore.createTuitionPlan(form.value)
      message.success(t('common.success'))
    }
    handleCancel()
  } catch (error) {
    message.error('Error saving plan')
  }
}

const handleCancel = () => {
  showModal.value = false
  editingPlan.value = null
  form.value = {
    name: 'Monthly',
    amount: 0,
    autoGenerateInvoices: true,
    dueDates: []
  }
  startDate.value = null
}

onMounted(() => {
  financeStore.fetchTuitionPlans()
})
</script>

<style scoped>
.tuition-plans-page {
  padding: 20px;
}
</style>

