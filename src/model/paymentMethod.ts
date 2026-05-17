export interface PaymentMethod {
  type: 'cash' | 'card' | 'transfer' | 'cheque'
  reference?: string
  bankName?: string
  gatewayId?: string
  chequeNumber?: string
}

export interface Payment {
  id: string
  studentId: number
  amount: number
  method: PaymentMethod
  date: string // ISO date string
  ledgerId?: string // Reference to payment ledger
  invoiceId?: string
  receiptId?: string
  notes?: string
  createdAt?: string
  createdBy?: string
}

