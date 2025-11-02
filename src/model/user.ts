export interface User {
  id: number;
  username: string;
  name: string;
  password?: string; // Optional as we don't always want to expose it
  role: 'admin' | 'user' | 'staff'; // changed: only admin/user/staff
  active: boolean;
  createdAt: Date;
}

export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
  STAFF: 'staff'
} as const;