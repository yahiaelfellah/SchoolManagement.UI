export interface TuitionPlan {
  id: string
  name: 'Monthly' | 'Term' | 'Yearly'
  amount: number
  dueDates: string[] // ISO date strings
  autoGenerateInvoices: boolean
  createdAt?: string
  updatedAt?: string
}

