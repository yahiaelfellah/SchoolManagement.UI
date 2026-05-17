export interface User {
  id: string
  username: string
  name: string
  password?: string
  role: 'admin' | 'user' | 'staff' | 'Teacher'
  active: boolean
  createdAt: Date
}

export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
  STAFF: 'staff',
  TEACHER: 'Teacher',
} as const
