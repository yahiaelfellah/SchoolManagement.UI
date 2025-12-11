<template>
  <div class="add-payment-page">
    <a-page-header
      title="Add Payment"
      sub-title="Record a new payment transaction"
      @back="() => $router.push({ name: 'Finance' })"
    />

    <a-card>
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        layout="vertical"
        @finish="handleSubmit"
      >
        <a-form-item label="Student" name="studentId" required>
          <a-select
            v-model:value="form.studentId"
            placeholder="Select student"
            show-search
            :filter-option="false"
          >
            <a-select-option :value="1">Student 1</a-select-option>
            <a-select-option :value="2">Student 2</a-select-option>
            <a-select-option :value="3">Student 3</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Amount (TND)" name="amount" required>
          <a-input-number
            v-model:value="form.amount"
            :min="0"
            style="width: 100%"
            placeholder="Enter amount"
          />
        </a-form-item>

        <a-form-item label="Payment Date" name="date" required>
          <a-date-picker
            v-model:value="form.date"
            style="width: 100%"
            format="YYYY-MM-DD"
          />
        </a-form-item>

        <a-form-item label="Payment Method" name="methodType" required>
          <a-select
            v-model:value="form.methodType"
            placeholder="Select payment method"
            @change="handleMethodChange"
          >
            <a-select-option value="cash">Cash</a-select-option>
            <a-select-option value="card">Card</a-select-option>
            <a-select-option value="transfer">Bank Transfer</a-select-option>
            <a-select-option value="cheque">Cheque</a-select-option>
          </a-select>
        </a-form-item>

        <!-- Payment Method Details -->
        <template v-if="form.methodType === 'transfer'">
          <a-form-item label="Bank Name">
            <a-input v-model:value="form.bankName" placeholder="Enter bank name" />
          </a-form-item>
          <a-form-item label="Reference Number">
            <a-input v-model:value="form.reference" placeholder="Transaction reference" />
          </a-form-item>
        </template>

        <template v-if="form.methodType === 'card'">
          <a-form-item label="Gateway Transaction ID">
            <a-input v-model:value="form.gatewayId" placeholder="Gateway transaction ID" />
          </a-form-item>
          <a-form-item label="Reference Number">
            <a-input v-model:value="form.reference" placeholder="Card reference" />
          </a-form-item>
        </template>

        <template v-if="form.methodType === 'cheque'">
          <a-form-item label="Cheque Number" required>
            <a-input v-model:value="form.chequeNumber" placeholder="Enter cheque number" />
          </a-form-item>
          <a-form-item label="Bank Name">
            <a-input v-model:value="form.bankName" placeholder="Enter bank name" />
          </a-form-item>
        </template>

        <template v-if="form.methodType === 'cash'">
          <a-form-item label="Reference (Optional)">
            <a-input v-model:value="form.reference" placeholder="Optional reference" />
          </a-form-item>
        </template>

        <a-form-item label="Apply to Ledger (Optional)">
          <a-select
            v-model:value="form.ledgerId"
            placeholder="Select ledger entry (optional)"
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

        <a-form-item label="Notes">
          <a-textarea
            v-model:value="form.notes"
            :rows="3"
            placeholder="Additional notes"
          />
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="form.generateReceipt">
            Generate receipt immediately
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">
            Save Payment
          </a-button>
          <a-button style="margin-left: 8px" @click="handleCancel">
            Cancel
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

const router = useRouter()
const financeStore = useFinanceStore()
const { paymentLedgers, loading } = financeStore

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

