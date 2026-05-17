<template>
  <a-card :title="`Invoice ${invoice.invoiceNumber}`">
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

    <div class="invoice-content">
      <div class="invoice-header">
        <div>
          <h2>INVOICE</h2>
          <p><strong>Invoice Number:</strong> {{ invoice.invoiceNumber }}</p>
          <p><strong>Generated:</strong> {{ formatDate(invoice.generatedAt) }}</p>
          <p><strong>Due Date:</strong> {{ formatDate(invoice.dueDate) }}</p>
          <a-tag :color="getStatusColor(invoice.status)">
            {{ invoice.status.toUpperCase() }}
          </a-tag>
        </div>
        <div>
          <p><strong>Student ID:</strong> {{ invoice.studentId }}</p>
        </div>
      </div>

      <a-table
        :columns="columns"
        :data-source="invoiceItems"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            {{ record.amount.toLocaleString() }} TND
          </template>
        </template>
      </a-table>

      <div class="invoice-total">
        <strong>Total Amount: {{ invoice.amount.toLocaleString() }} TND</strong>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { message } from 'ant-design-vue'
import { DownloadOutlined } from '@ant-design/icons-vue'
import type { Invoice } from '@/model/invoice'
import { useFinanceStore } from '@/stores/financeStore'
import dayjs from 'dayjs'

const props = defineProps<{
  invoice: Invoice
}>()

const emit = defineEmits<{
  close: []
}>()

const financeStore = useFinanceStore()
const services = computed(() => financeStore.services)
const invoiceItems = computed(() => {
  const items = [
    {
      key: 'tuition',
      description: 'Tuition Fee',
      amount: props.invoice.tuitionAmount
    }
  ]

  Object.entries(props.invoice.servicesBreakdown).forEach(([serviceId, amount]) => {
    const service = services.value.find(s => s.id === serviceId)
    items.push({
      key: `service-${serviceId}`,
      description: service?.name || `Service ${serviceId}`,
      amount
    })
  })

  return items
})

const columns = [
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Amount (TND)', key: 'amount', align: 'right' as const }
]

const formatDate = (date: string) => {
  return dayjs(date).format('DD MMM YYYY')
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'green'
    case 'pending':
      return 'orange'
    case 'overdue':
      return 'red'
    default:
      return 'default'
  }
}

const handleDownloadPDF = () => {
  try {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      message.error('Please allow popups to download PDF')
      return
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${props.invoice.invoiceNumber}</title>
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
            .invoice-title {
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
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .total-row {
              margin-top: 20px;
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              padding-top: 20px;
              border-top: 2px solid #000;
            }
            .status {
              display: inline-block;
              padding: 5px 15px;
              border-radius: 4px;
              font-weight: bold;
              margin-top: 10px;
            }
            .status.paid { background-color: #52c41a; color: white; }
            .status.pending { background-color: #faad14; color: white; }
            .status.overdue { background-color: #ff4d4f; color: white; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div class="info-section">
                <p><strong>Invoice Number:</strong> ${props.invoice.invoiceNumber}</p>
                <p><strong>Generated:</strong> ${formatDate(props.invoice.generatedAt)}</p>
                <p><strong>Due Date:</strong> ${formatDate(props.invoice.dueDate)}</p>
                <span class="status ${props.invoice.status}">${props.invoice.status.toUpperCase()}</span>
              </div>
            </div>
            <div class="info-section">
              <p><strong>Student ID:</strong> ${props.invoice.studentId}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount (TND)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tuition Fee</td>
                <td style="text-align: right;">${props.invoice.tuitionAmount.toLocaleString()}</td>
              </tr>
              ${Object.entries(props.invoice.servicesBreakdown).map(([serviceId, amount]) => `
                <tr>
                  <td>Service ${serviceId}</td>
                  <td style="text-align: right;">${amount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-row">
            <div>
              <strong>Total Amount: ${props.invoice.amount.toLocaleString()} TND</strong>
            </div>
          </div>

          <div style="margin-top: 50px; text-align: center; color: #888; font-size: 12px;">
            <p>This is an automatically generated invoice.</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(invoiceHTML)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      message.success('Invoice ready for printing/saving as PDF')
    }, 250)
  } catch (error) {
    console.error('Error generating PDF:', error)
    message.error('Failed to generate PDF')
  }
}
</script>

<style scoped>
.invoice-content {
  padding: 20px;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.invoice-total {
  margin-top: 20px;
  text-align: right;
  font-size: 18px;
  font-weight: bold;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}
</style>

