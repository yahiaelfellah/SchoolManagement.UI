export interface FinanceDashboardStats {
  totalCollectedThisMonth: number
  outstandingBalance: number
  overdueCount: number
  partialPaymentCount: number
  revenueData: RevenueDataPoint[]
  popularServices: PopularService[]
  paymentMethodsStats: PaymentMethodStat[]
}

export interface RevenueDataPoint {
  month: string // 'YYYY-MM'
  amount: number
}

export interface PopularService {
  serviceId: string
  serviceName: string
  studentCount: number
  totalRevenue: number
}

export interface PaymentMethodStat {
  method: 'cash' | 'card' | 'transfer' | 'cheque'
  count: number
  totalAmount: number
  percentage: number
}

export interface OverdueStudent {
  studentId: number
  studentName: string
  overdueAmount: number
  overdueMonths: string[] // ['YYYY-MM']
  lastPaymentDate?: string
}

