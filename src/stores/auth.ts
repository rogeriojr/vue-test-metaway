import { defineStore } from 'pinia'
import api from '@/services/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  rememberMe: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || null,
    rememberMe: false
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await api.post('/auth/login', { username, password })
        this.token = response.data.accessToken
        this.user = response.data

        if (this.rememberMe) {
          localStorage.setItem('token', this.token || '')
        }

        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  },
  getters: {
    isAdmin: (state) => state.user?.tipos?.includes('ADMIN')
  }
})
