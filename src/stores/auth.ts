import type { User } from '@/model/user'
import { defineStore } from 'pinia'
import { loginRequest } from '@/api/auth'
import { ApiError } from '@/api/client'

function mapRole(role: string): User['role'] {
  if (role === 'Teacher') return 'Teacher'
  if (role === 'admin') return 'admin'
  if (role === 'staff') return 'staff'
  return 'user'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
    lastError: '' as string,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username: string, password: string) {
      this.lastError = ''
      try {
        const res = await loginRequest(username, password)
        this.token = res.token
        this.user = {
          id: res.user.id,
          username: res.user.username,
          name: res.user.name,
          role: mapRole(res.user.role),
          active: true,
          createdAt: new Date(),
        }
        localStorage.setItem('token', this.token)
        return true
      } catch (e) {
        if (e instanceof ApiError) {
          this.lastError =
            e.status === 401 ? 'Invalid credentials' : e.message
        } else {
          this.lastError = 'Network error'
        }
        return false
      }
    },
    logout() {
      this.user = null
      this.token = ''
      this.lastError = ''
      localStorage.removeItem('token')
    },
  },
})
