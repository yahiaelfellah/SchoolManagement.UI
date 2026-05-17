export interface AuditLog {
  id: string
  action: string // e.g., 'Payment Added', 'Tuition Plan Changed', 'Invoice Generated'
  performedBy: string // userId
  timestamp: string // ISO date string
  details: string // JSON string or description
  entityType?: string // 'payment', 'invoice', 'tuitionPlan', etc.
  entityId?: string
  createdAt?: string
}

