import type { PaymentDto } from '@/model/paymentApi'
import { getJson } from './client'

export function fetchPaymentsByStudent(studentId: string) {
  return getJson<PaymentDto[]>(
    `/api/Payment/student/${encodeURIComponent(studentId)}`
  )
}
