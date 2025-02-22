import { defineStore } from 'pinia'
import api from '@/services/api'
import type { User, AuthResponse, ApiResponse } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  rememberMe: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    rememberMe: false
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await api.post<AuthResponse>('/auth/login', { username, password })
        this.token = response.data.accessToken
        this.user = {
          id: response.data.id,
          username: response.data.username,
          nome: '',
          cpf: '',
          email: '',
          telefone: '',
          dataNascimento: '',
          tipos: response.data.tipos
        }

        if (this.rememberMe) {
          localStorage.setItem('token', this.token)
        }

        await this.fetchUserData()
        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async fetchUserData() {
      if (!this.user?.id) return
      try {
        const response = await api.get<ApiResponse<{ usuario: User }>>(`/usuario/buscar/${this.user.id}`)
        this.user = response.data.object.usuario
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    },

    async refreshAuth() {
      try {
        const response = await api.post<AuthResponse>('/auth/refresh', {
          refreshToken: this.refreshToken
        })
        this.token = response.data.accessToken
        localStorage.setItem('token', this.token)
        return true
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  },
  getters: {
    isAdmin: (state) => state.user?.tipos?.includes('ADMIN') || false
  }
})
