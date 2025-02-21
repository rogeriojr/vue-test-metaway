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
    async login(login: string, senha: string) {
      try {
        const response = await api.post('/auth/login', { login, senha })
        this.token = response.data.token
        this.user = response.data.user

        if (this.rememberMe) {
          localStorage.setItem('token', this.token)
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
    isAdmin: (state) => state.user?.tipo === 'ADMIN'
  }
})
