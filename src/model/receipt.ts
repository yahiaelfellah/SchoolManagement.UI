import type { PaymentMethod } from './paymentMethod'

export interface Receipt {
  id: string
  receiptNumber: string // Unique receipt number
  paymentId: string
  studentId: number
  amount: number
  paymentMethod: PaymentMethod
  paymentDate: string // ISO date string
  generatedAt: string
  createdAt?: string
}

