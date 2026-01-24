<template>
  <div class="add-payment-page">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <a-card>
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-form-item
          :label="tl('form.student')"
          name="studentId"
          required
        >
          <a-select
            v-model:value="form.studentId"
            :placeholder="tl('form.selectStudent')"
            show-search
            :filter-option="false"
          >
            <a-select-option :value="1">
              Student 1
            </a-select-option>
            <a-select-option :value="2">
              Student 2
            </a-select-option>
            <a-select-option :value="3">
              Student 3
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="tl('form.amount')"
          name="amount"
          required
        >
          <a-input-number
            v-model:value="form.amount"
            :min="0"
            style="width: 100%"
            :placeholder="tl('form.enterAmount')"
          />
        </a-form-item>

        <a-form-item
          :label="tl('form.date')"
          name="date"
          required
        >
          <a-date-picker
            v-model:value="form.date"
            style="width: 100%"
            format="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item
          :label="tl('form.method')"
          name="methodType"
          required
        >
          <a-select
            v-model:value="form.methodType"
            :placeholder="tl('form.selectMethod')"
            @change="handleMethodChange"
          >
            <a-select-option value="cash">
              tl('form.methods.cash')
            </a-select-option>
          </a-select>
        </a-form-item>


        <template v-if="form.methodType === 'cash'">
          <a-form-item
            :label="tl('form.reference')"
            name="reference"
          >
            <a-input
              v-model:value="form.reference"
              :placeholder="tl('form.referencePlaceholder')"
            />
          </a-form-item>
        </template>

        <a-form-item
          :label="tl('form.applyToLedger')"
          name="ledgerId"
        >
          <a-select
            v-model:value="form.ledgerId"
            :placeholder="tl('form.applyToLedgerPlaceholder')"
            allow-clear
          >
            <a-select-option
              v-for="ledger in availableLedgers"
              :key="ledger.id"
              :value="ledger.id"
            >
              {{ formatLedgerLabel(ledger) }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="tl('form.notes')"
          name="notes"
        >
          <a-textarea
            v-model:value="form.notes"
            :rows="3"
            :placeholder="tl('form.notesPlaceholder')"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="form.generateReceipt">
            {{ tl('form.generateReceipt') }}
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
          >
            {{ t('common.save') }}
          </a-button>
          <a-button
            style="margin-left: 8px"
            @click="handleCancel"
          >
            {{ t('common.cancel') }} 
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/financeStore'
import type { PaymentMethod } from '@/model/paymentMethod'
import type { PaymentLedger } from '@/model/paymentLedger'
import dayjs, { type Dayjs } from 'dayjs'
import { useLocalI18n } from '@/helpers/useLocalI18n'

const { t, tl } = useLocalI18n('operations.finance.addPayment')
const router = useRouter()
const financeStore = useFinanceStore()
const paymentLedgers = computed(() => financeStore.paymentLedgers)
const loading = computed(() => financeStore.loading)
const formRef = ref()

const form = ref({
  studentId: undefined as number | undefined,
  amount: undefined as number | undefined,
  date: dayjs() as Dayjs | null,
  methodType: undefined as 'cash' | 'card' | 'transfer' | 'cheque' | undefined,
  bankName: '',
  reference: '',
  gatewayId: '',
  chequeNumber: '',
  ledgerId: undefined as string | undefined,
  notes: '',
  generateReceipt: true
})

const rules = {
  studentId: [{ required: true, message: 'Please select a student' }],
  amount: [{ required: true, message: 'Please enter amount' }],
  date: [{ required: true, message: 'Please select payment date' }],
  methodType: [{ required: true, message: 'Please select payment method' }],
  chequeNumber: [
    {
      required: () => form.value.methodType === 'cheque',
      message: 'Cheque number is required'
    }
  ]
}

const availableLedgers = computed(() => {
  if (!form.value.studentId) return []
  return paymentLedgers.value.filter(l => l.studentId === form.value.studentId)
})

const formatLedgerLabel = (ledger: PaymentLedger) => {
  return `${ledger.month} - Due: ${ledger.amountDue.toLocaleString()} TND, Balance: ${ledger.balance.toLocaleString()} TND`
}

const handleMethodChange = () => {
  // Reset method-specific fields when method changes
  form.value.bankName = ''
  form.value.reference = ''
  form.value.gatewayId = ''
  form.value.chequeNumber = ''
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    if (!form.value.methodType) {
      message.error('Please select a payment method')
      return
    }

    const paymentMethod: PaymentMethod = {
      type: form.value.methodType,
      reference: form.value.reference || undefined,
      bankName: form.value.bankName || undefined,
      gatewayId: form.value.gatewayId || undefined,
      chequeNumber: form.value.chequeNumber || undefined
    }

    const payment = await financeStore.createPayment({
      studentId: form.value.studentId!,
      amount: form.value.amount!,
      method: paymentMethod,
      date: form.value.date!.format('YYYY-MM-DD'),
      ledgerId: form.value.ledgerId,
      notes: form.value.notes || undefined
    })

    if (form.value.generateReceipt) {
      await financeStore.generateReceipt(payment.id, payment.studentId)
      message.success('Payment recorded and receipt generated')
    } else {
      message.success('Payment recorded successfully')
    }

    router.push({ name: 'Finance' })
  } catch (error) {
    console.error('Validation error:', error)
    message.error('Please fill all required fields')
  }
}

const handleCancel = () => {
  router.push({ name: 'Finance' })
}

onMounted(() => {
  financeStore.fetchPaymentLedgers()
})
</script>

<style scoped>
.add-payment-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>

