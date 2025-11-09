import type User from '@/model/user'
import { defineStore } from 'pinia'



export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(username: string, password: string) {
      // Fake auth for now
      if (username === 'admin' && password === '1234') {
        this.token = 'fake-token'
        this.user = { name: 'Admin', role: 'Administrator' }
        localStorage.setItem('token', this.token)
        return true
      }
      return false
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
