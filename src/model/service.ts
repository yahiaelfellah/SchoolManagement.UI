export interface Service {
  id: string
  name: string
  cost: number
  recurring: boolean
  discountAllowed: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface StudentService {
  id: string
  studentId: number
  serviceId: string
  enabled: boolean
  customCost?: number // Override default cost if needed
  startDate?: string
  endDate?: string
  createdAt?: string
}

