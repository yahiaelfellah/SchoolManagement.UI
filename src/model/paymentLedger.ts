export interface PaymentLedger {
  id: string
  studentId: number
  month: string // Format: 'YYYY-MM'
  amountDue: number
  amountPaid: number
  balance: number
  servicesBreakdown: Record<string, number> // serviceId -> amount
  status: 'paid' | 'partial' | 'overdue'
  dueDate: string // ISO date string
  createdAt?: string
  updatedAt?: string
}

