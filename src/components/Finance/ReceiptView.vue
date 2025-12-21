<template>
  <a-card :title="`Receipt ${receipt.receiptNumber}`">
    <template #extra>
      <a-space>
        <a-button @click="handleDownloadPDF">
          <template #icon>
            <DownloadOutlined />
          </template>
          Download PDF
        </a-button>
        <a-button @click="$emit('close')">
          Close
        </a-button>
      </a-space>
    </template>

    <div class="receipt-content">
      <div class="receipt-header">
        <div>
          <h2>RECEIPT</h2>
          <p><strong>Receipt Number:</strong> {{ receipt.receiptNumber }}</p>
          <p><strong>Generated:</strong> {{ formatDate(receipt.generatedAt) }}</p>
          <p><strong>Payment Date:</strong> {{ formatDate(receipt.paymentDate) }}</p>
        </div>
        <div>
          <p><strong>Student ID:</strong> {{ receipt.studentId }}</p>
        </div>
      </div>

      <div class="receipt-details">
        <div class="detail-row">
          <span class="detail-label">Payment Method:</span>
          <span>{{ formatPaymentMethod(receipt.paymentMethod) }}</span>
        </div>
        <div
          v-if="receipt.paymentMethod.reference"
          class="detail-row"
        >
          <span class="detail-label">Reference:</span>
          <span>{{ receipt.paymentMethod.reference }}</span>
        </div>
        <div
          v-if="receipt.paymentMethod.bankName"
          class="detail-row"
        >
          <span class="detail-label">Bank:</span>
          <span>{{ receipt.paymentMethod.bankName }}</span>
        </div>
        <div
          v-if="receipt.paymentMethod.chequeNumber"
          class="detail-row"
        >
          <span class="detail-label">Cheque Number:</span>
          <span>{{ receipt.paymentMethod.chequeNumber }}</span>
        </div>
        <div
          v-if="receipt.paymentMethod.gatewayId"
          class="detail-row"
        >
          <span class="detail-label">Gateway Transaction ID:</span>
          <span>{{ receipt.paymentMethod.gatewayId }}</span>
        </div>
      </div>

      <div class="receipt-total">
        <strong>Amount Paid: {{ receipt.amount.toLocaleString() }} TND</strong>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { DownloadOutlined } from '@ant-design/icons-vue'
import type { Receipt } from '@/model/receipt'
import dayjs from 'dayjs'

const props = defineProps<{
  receipt: Receipt
}>()

const emit = defineEmits<{
  close: []
}>()

const formatDate = (date: string) => {
  return dayjs(date).format('DD MMM YYYY')
}

const formatPaymentMethod = (method: Receipt['paymentMethod']) => {
  const type = method.type.toUpperCase()
  if (method.type === 'transfer' && method.bankName) {
    return `${type} - ${method.bankName}`
  }
  return type
}

const handleDownloadPDF = () => {
  try {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      message.error('Please allow popups to download PDF')
      return
    }

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt ${props.receipt.receiptNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .receipt-title {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-section p {
              margin: 5px 0;
            }
            .details-section {
              margin: 30px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #ddd;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: bold;
            }
            .total-amount {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #000;
              text-align: right;
              font-size: 20px;
              font-weight: bold;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="receipt-title">RECEIPT</div>
              <div class="info-section">
                <p><strong>Receipt Number:</strong> ${props.receipt.receiptNumber}</p>
                <p><strong>Generated:</strong> ${formatDate(props.receipt.generatedAt)}</p>
                <p><strong>Payment Date:</strong> ${formatDate(props.receipt.paymentDate)}</p>
              </div>
            </div>
            <div class="info-section">
              <p><strong>Student ID:</strong> ${props.receipt.studentId}</p>
            </div>
          </div>

          <div class="details-section">
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span>${formatPaymentMethod(props.receipt.paymentMethod)}</span>
            </div>
            ${props.receipt.paymentMethod.reference ? `
              <div class="detail-row">
                <span class="detail-label">Reference:</span>
                <span>${props.receipt.paymentMethod.reference}</span>
              </div>
            ` : ''}
            ${props.receipt.paymentMethod.bankName ? `
              <div class="detail-row">
                <span class="detail-label">Bank:</span>
                <span>${props.receipt.paymentMethod.bankName}</span>
              </div>
            ` : ''}
            ${props.receipt.paymentMethod.chequeNumber ? `
              <div class="detail-row">
                <span class="detail-label">Cheque Number:</span>
                <span>${props.receipt.paymentMethod.chequeNumber}</span>
              </div>
            ` : ''}
            ${props.receipt.paymentMethod.gatewayId ? `
              <div class="detail-row">
                <span class="detail-label">Gateway Transaction ID:</span>
                <span>${props.receipt.paymentMethod.gatewayId}</span>
              </div>
            ` : ''}
          </div>

          <div class="total-amount">
            <div>
              <strong>Amount Paid: ${props.receipt.amount.toLocaleString()} TND</strong>
            </div>
          </div>

          <div style="margin-top: 50px; text-align: center; color: #888; font-size: 12px;">
            <p>This is an automatically generated receipt.</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(receiptHTML)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      message.success('Receipt ready for printing/saving as PDF')
    }, 250)
  } catch (error) {
    console.error('Error generating PDF:', error)
    message.error('Failed to generate PDF')
  }
}
</script>

<style scoped>
.receipt-content {
  padding: 20px;
}

.receipt-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.receipt-details {
  margin: 30px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: bold;
}

.receipt-total {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
  text-align: right;
  font-size: 20px;
  font-weight: bold;
}
</style>

