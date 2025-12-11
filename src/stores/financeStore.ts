import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TuitionPlan } from '@/model/tuitionPlan'
import type { PaymentLedger } from '@/model/paymentLedger'
import type { Payment, PaymentMethod } from '@/model/paymentMethod'
import type { Service, StudentService } from '@/model/service'
import type { Invoice } from '@/model/invoice'
import type { Receipt } from '@/model/receipt'
import type { AuditLog } from '@/model/auditLog'
import type { FinanceDashboardStats, OverdueStudent } from '@/model/financeDashboard'
import dayjs from 'dayjs'

export const useFinanceStore = defineStore('finance', () => {
  // State
  const loading = ref(false)
  const tuitionPlans = ref<TuitionPlan[]>([])
  const paymentLedgers = ref<PaymentLedger[]>([])
  const payments = ref<Payment[]>([])
  const services = ref<Service[]>([])
  const studentServices = ref<StudentService[]>([])
  const invoices = ref<Invoice[]>([])
  const receipts = ref<Receipt[]>([])
  const auditLogs = ref<AuditLog[]>([])
  const dashboardStats = ref<FinanceDashboardStats | null>(null)

  // Computed
  const overdueCount = computed(() => {
    return paymentLedgers.value.filter(l => l.status === 'overdue').length
  })

  const partialPaymentCount = computed(() => {
    return paymentLedgers.value.filter(l => l.status === 'partial').length
  })

  const overdueStudents = computed<OverdueStudent[]>(() => {
    const overdueMap = new Map<number, OverdueStudent>()
    
    paymentLedgers.value
      .filter(l => l.status === 'overdue')
      .forEach(ledger => {
        if (!overdueMap.has(ledger.studentId)) {
          overdueMap.set(ledger.studentId, {
            studentId: ledger.studentId,
            studentName: `Student ${ledger.studentId}`, // TODO: Fetch from student store
            overdueAmount: 0,
            overdueMonths: []
          })
        }
        const student = overdueMap.get(ledger.studentId)!
        student.overdueAmount += ledger.balance
        student.overdueMonths.push(ledger.month)
      })
    
    return Array.from(overdueMap.values())
  })

  // Tuition Plans
  async function fetchTuitionPlans() {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      // Mock data
      if (tuitionPlans.value.length === 0) {
        tuitionPlans.value = [
          {
            id: '1',
            name: 'Monthly',
            amount: 1000,
            dueDates: [],
            autoGenerateInvoices: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Term',
            amount: 3000,
            dueDates: [],
            autoGenerateInvoices: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Yearly',
            amount: 10000,
            dueDates: [],
            autoGenerateInvoices: true,
            createdAt: new Date().toISOString()
          }
        ]
      }
    } finally {
      loading.value = false
    }
  }

  async function createTuitionPlan(plan: Omit<TuitionPlan, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const newPlan: TuitionPlan = {
        ...plan,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      tuitionPlans.value.push(newPlan)
      logAudit('Tuition Plan Created', `Created plan: ${plan.name}`, 'tuitionPlan', newPlan.id)
      return newPlan
    } finally {
      loading.value = false
    }
  }

  async function updateTuitionPlan(id: string, updates: Partial<TuitionPlan>) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const index = tuitionPlans.value.findIndex(p => p.id === id)
      if (index !== -1) {
        tuitionPlans.value[index] = {
          ...tuitionPlans.value[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        logAudit('Tuition Plan Updated', `Updated plan: ${id}`, 'tuitionPlan', id)
        return tuitionPlans.value[index]
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteTuitionPlan(id: string) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      tuitionPlans.value = tuitionPlans.value.filter(p => p.id !== id)
      logAudit('Tuition Plan Deleted', `Deleted plan: ${id}`, 'tuitionPlan', id)
    } finally {
      loading.value = false
    }
  }

  function generateDueDates(planType: 'Monthly' | 'Term' | 'Yearly', startDate: string): string[] {
    const dates: string[] = []
    const start = dayjs(startDate)
    
    if (planType === 'Monthly') {
      for (let i = 0; i < 12; i++) {
        dates.push(start.add(i, 'month').date(5).format('YYYY-MM-DD'))
      }
    } else if (planType === 'Term') {
      // 3 terms per year
      dates.push(start.date(5).format('YYYY-MM-DD'))
      dates.push(start.add(4, 'month').date(5).format('YYYY-MM-DD'))
      dates.push(start.add(8, 'month').date(5).format('YYYY-MM-DD'))
    } else if (planType === 'Yearly') {
      dates.push(start.date(5).format('YYYY-MM-DD'))
    }
    
    return dates
  }

  // Payment Ledgers
  async function fetchPaymentLedgers(studentId?: number) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      // Mock data - initialize if empty
      if (paymentLedgers.value.length === 0) {
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`
        
        paymentLedgers.value = [
          {
            id: '1',
            studentId: 1,
            month: currentMonth,
            amountDue: 1200,
            amountPaid: 1200,
            balance: 0,
            servicesBreakdown: { '1': 200, '2': 100 },
            status: 'paid',
            dueDate: new Date(now.getFullYear(), now.getMonth(), 5).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            studentId: 2,
            month: lastMonthStr,
            amountDue: 1500,
            amountPaid: 500,
            balance: 1000,
            servicesBreakdown: { '1': 200 },
            status: 'overdue',
            dueDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 5).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            studentId: 3,
            month: currentMonth,
            amountDue: 1800,
            amountPaid: 900,
            balance: 900,
            servicesBreakdown: { '2': 100, '3': 150 },
            status: 'partial',
            dueDate: new Date(now.getFullYear(), now.getMonth(), 10).toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      }
      
      if (studentId) {
        return paymentLedgers.value.filter(l => l.studentId === studentId)
      }
    } finally {
      loading.value = false
    }
  }

  async function createPaymentLedger(ledger: Omit<PaymentLedger, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const status = calculateLedgerStatus(ledger.amountDue, ledger.amountPaid, ledger.dueDate)
      const newLedger: PaymentLedger = {
        ...ledger,
        id: Date.now().toString(),
        status,
        balance: ledger.amountDue - ledger.amountPaid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      paymentLedgers.value.push(newLedger)
      logAudit('Payment Ledger Created', `Created ledger for student ${ledger.studentId}`, 'paymentLedger', newLedger.id)
      return newLedger
    } finally {
      loading.value = false
    }
  }

  function calculateLedgerStatus(amountDue: number, amountPaid: number, dueDate: string): 'paid' | 'partial' | 'overdue' {
    if (amountPaid >= amountDue) {
      return 'paid'
    }
    const isOverdue = dayjs().isAfter(dayjs(dueDate))
    return isOverdue ? 'overdue' : 'partial'
  }

  // Payments
  async function fetchPayments(studentId?: number) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      // Mock data - initialize if empty
      if (payments.value.length === 0) {
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`
        
        payments.value = [
          {
            id: '1',
            studentId: 1,
            amount: 1200,
            method: { type: 'cash' },
            date: `${currentMonth}-05`,
            ledgerId: '1',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            studentId: 2,
            amount: 500,
            method: { type: 'transfer', bankName: 'Bank ABC', reference: 'TXN-12345' },
            date: `${lastMonthStr}-10`,
            ledgerId: '2',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            studentId: 3,
            amount: 900,
            method: { type: 'card', gatewayId: 'GW-67890', reference: 'CARD-001' },
            date: `${currentMonth}-08`,
            ledgerId: '3',
            createdAt: new Date().toISOString()
          }
        ]
      }
      
      if (studentId) {
        return payments.value.filter(p => p.studentId === studentId)
      }
    } finally {
      loading.value = false
    }
  }

  async function createPayment(payment: Omit<Payment, 'id' | 'createdAt'>) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const newPayment: Payment = {
        ...payment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      payments.value.push(newPayment)
      
      // Update ledger if linked
      if (payment.ledgerId) {
        const ledger = paymentLedgers.value.find(l => l.id === payment.ledgerId)
        if (ledger) {
          ledger.amountPaid += payment.amount
          ledger.balance = ledger.amountDue - ledger.amountPaid
          ledger.status = calculateLedgerStatus(ledger.amountDue, ledger.amountPaid, ledger.dueDate)
          ledger.updatedAt = new Date().toISOString()
        }
      }
      
      logAudit('Payment Added', `Payment of ${payment.amount} TND added for student ${payment.studentId}`, 'payment', newPayment.id)
      return newPayment
    } finally {
      loading.value = false
    }
  }

  // Services
  async function fetchServices() {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      // Mock data
      if (services.value.length === 0) {
        services.value = [
          {
            id: '1',
            name: 'Transport',
            cost: 200,
            recurring: true,
            discountAllowed: true,
            description: 'School bus transportation',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Lunch',
            cost: 100,
            recurring: true,
            discountAllowed: false,
            description: 'Daily lunch service',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Books',
            cost: 150,
            recurring: false,
            discountAllowed: true,
            description: 'Textbooks and materials',
            createdAt: new Date().toISOString()
          }
        ]
      }
    } finally {
      loading.value = false
    }
  }

  async function createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const newService: Service = {
        ...service,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      services.value.push(newService)
      logAudit('Service Created', `Created service: ${service.name}`, 'service', newService.id)
      return newService
    } finally {
      loading.value = false
    }
  }

  async function updateService(id: string, updates: Partial<Service>) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const index = services.value.findIndex(s => s.id === id)
      if (index !== -1) {
        services.value[index] = {
          ...services.value[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        logAudit('Service Updated', `Updated service: ${id}`, 'service', id)
        return services.value[index]
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteService(id: string) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      services.value = services.value.filter(s => s.id !== id)
      logAudit('Service Deleted', `Deleted service: ${id}`, 'service', id)
    } finally {
      loading.value = false
    }
  }

  // Invoices
  async function generateInvoice(ledgerId: string, studentId: number) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const ledger = paymentLedgers.value.find(l => l.id === ledgerId)
      if (!ledger) throw new Error('Ledger not found')
      
      const invoiceNumber = `INV-${Date.now()}`
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber,
        studentId,
        ledgerId,
        dueDate: ledger.dueDate,
        amount: ledger.amountDue,
        tuitionAmount: ledger.amountDue - Object.values(ledger.servicesBreakdown).reduce((sum, amt) => sum + amt, 0),
        servicesBreakdown: ledger.servicesBreakdown,
        status: calculateLedgerStatus(ledger.amountDue, ledger.amountPaid, ledger.dueDate) === 'paid' ? 'paid' : 'pending',
        generatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      invoices.value.push(newInvoice)
      logAudit('Invoice Generated', `Generated invoice ${invoiceNumber}`, 'invoice', newInvoice.id)
      return newInvoice
    } finally {
      loading.value = false
    }
  }

  async function fetchInvoices(studentId?: number) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      if (studentId) {
        return invoices.value.filter(i => i.studentId === studentId)
      }
      return invoices.value
    } finally {
      loading.value = false
    }
  }

  // Receipts
  async function generateReceipt(paymentId: string, studentId: number) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const payment = payments.value.find(p => p.id === paymentId)
      if (!payment) throw new Error('Payment not found')
      
      const receiptNumber = `RCP-${Date.now()}`
      const newReceipt: Receipt = {
        id: Date.now().toString(),
        receiptNumber,
        paymentId,
        studentId,
        amount: payment.amount,
        paymentMethod: payment.method,
        paymentDate: payment.date,
        generatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      receipts.value.push(newReceipt)
      
      // Link receipt to payment
      payment.receiptId = newReceipt.id
      
      logAudit('Receipt Generated', `Generated receipt ${receiptNumber}`, 'receipt', newReceipt.id)
      return newReceipt
    } finally {
      loading.value = false
    }
  }

  async function fetchReceipts(studentId?: number) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      if (studentId) {
        return receipts.value.filter(r => r.studentId === studentId)
      }
      return receipts.value
    } finally {
      loading.value = false
    }
  }

  // Dashboard
  async function fetchDashboardStats() {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

      // Calculate revenue data for last 6 months
      const revenueData: { month: string; amount: number }[] = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthRevenue = payments.value
          .filter(p => p.date.startsWith(monthStr))
          .reduce((sum, p) => sum + p.amount, 0)
        revenueData.push({ month: monthStr, amount: monthRevenue })
      }

      // Calculate popular services
      const serviceRevenue = new Map<string, { name: string; studentCount: number; totalRevenue: number }>()
      paymentLedgers.value.forEach(ledger => {
        Object.entries(ledger.servicesBreakdown).forEach(([serviceId, amount]) => {
          const service = services.value.find(s => s.id === serviceId)
          if (!serviceRevenue.has(serviceId)) {
            serviceRevenue.set(serviceId, {
              name: service?.name || `Service ${serviceId}`,
              studentCount: 0,
              totalRevenue: 0
            })
          }
          const entry = serviceRevenue.get(serviceId)!
          entry.studentCount++
          entry.totalRevenue += amount
        })
      })
      const popularServices = Array.from(serviceRevenue.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5)
        .map((entry, idx) => ({
          serviceId: Array.from(serviceRevenue.keys())[idx] || '',
          serviceName: entry.name,
          studentCount: entry.studentCount,
          totalRevenue: entry.totalRevenue
        }))

      // Calculate payment methods stats
      const methodStats = new Map<string, { count: number; totalAmount: number }>()
      let totalPaymentAmount = 0

      payments.value.forEach(payment => {
        const method = payment.method.type
        if (!methodStats.has(method)) {
          methodStats.set(method, { count: 0, totalAmount: 0 })
        }
        const stat = methodStats.get(method)!
        stat.count++
        stat.totalAmount += payment.amount
        totalPaymentAmount += payment.amount
      })

      const paymentMethodsStats = Array.from(methodStats.entries()).map(([method, stat]) => ({
        method: method as 'cash' | 'card' | 'transfer' | 'cheque',
        count: stat.count,
        totalAmount: stat.totalAmount,
        percentage: totalPaymentAmount > 0 ? Math.round((stat.totalAmount / totalPaymentAmount) * 100) : 0
      }))

      dashboardStats.value = {
        totalCollectedThisMonth: payments.value
          .filter(p => p.date.startsWith(currentMonth))
          .reduce((sum, p) => sum + p.amount, 0),
        outstandingBalance: paymentLedgers.value
          .reduce((sum, l) => sum + l.balance, 0),
        overdueCount: overdueCount.value,
        partialPaymentCount: partialPaymentCount.value,
        revenueData,
        popularServices,
        paymentMethodsStats
      }
    } finally {
      loading.value = false
    }
  }

  // Audit Log
  function logAudit(action: string, details: string, entityType?: string, entityId?: string) {
    const log: AuditLog = {
      id: Date.now().toString(),
      action,
      performedBy: 'current-user', // TODO: Get from auth store
      timestamp: new Date().toISOString(),
      details,
      entityType,
      entityId,
      createdAt: new Date().toISOString()
    }
    auditLogs.value.unshift(log) // Add to beginning
  }

  async function fetchAuditLogs(filters?: { action?: string; entityType?: string; startDate?: string; endDate?: string }) {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 300))
      let filtered = [...auditLogs.value]
      
      if (filters?.action) {
        filtered = filtered.filter(log => log.action.includes(filters.action!))
      }
      if (filters?.entityType) {
        filtered = filtered.filter(log => log.entityType === filters.entityType)
      }
      if (filters?.startDate) {
        filtered = filtered.filter(log => dayjs(log.timestamp).isAfter(dayjs(filters.startDate)))
      }
      if (filters?.endDate) {
        filtered = filtered.filter(log => dayjs(log.timestamp).isBefore(dayjs(filters.endDate)))
      }
      
      return filtered
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    loading,
    tuitionPlans,
    paymentLedgers,
    payments,
    services,
    studentServices,
    invoices,
    receipts,
    auditLogs,
    dashboardStats,
    // Computed
    overdueCount,
    partialPaymentCount,
    overdueStudents,
    // Actions
    fetchTuitionPlans,
    createTuitionPlan,
    updateTuitionPlan,
    deleteTuitionPlan,
    generateDueDates,
    fetchPaymentLedgers,
    createPaymentLedger,
    calculateLedgerStatus,
    fetchPayments,
    createPayment,
    fetchServices,
    createService,
    updateService,
    deleteService,
    generateInvoice,
    fetchInvoices,
    generateReceipt,
    fetchReceipts,
    fetchDashboardStats,
    logAudit,
    fetchAuditLogs
  }
})

