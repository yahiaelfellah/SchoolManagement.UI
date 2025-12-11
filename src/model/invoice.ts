export interface Invoice {
  id: string
  invoiceNumber: string // Unique invoice number
  studentId: number
  ledgerId: string
  dueDate: string // ISO date string
  amount: number
  tuitionAmount: number
  servicesBreakdown: Record<string, number> // serviceId -> amount
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  generatedAt: string
  paidAt?: string
  createdAt?: string
}

