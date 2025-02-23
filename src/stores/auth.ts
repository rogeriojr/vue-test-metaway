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
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    rememberMe: localStorage.getItem('rememberMe') === 'true'
  }),

  actions: {
    async login(username: string, password: string, rememberMe: boolean) {
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
        this.rememberMe = rememberMe

        if (this.rememberMe) {
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('rememberMe', 'true')
        } else {
          sessionStorage.setItem('token', this.token)
          sessionStorage.setItem('user', JSON.stringify(this.user))
        }

        await this.fetchUserData()
        return true
      } catch (error) {
        console.error('Falha no login:', error)
        throw error
      }
    },

    async fetchUserData() {
      if (!this.user?.id) return
      try {
        const response = await api.get<ApiResponse<{ usuario: User }>>(`/usuario/buscar/${this.user.id}`)
        this.user = {
          ...this.user,
          ...response.data.object.usuario
        }
        if (this.rememberMe) {
          localStorage.setItem('user', JSON.stringify(this.user))
        } else {
          sessionStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
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
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
    },

    async initialize() {
      if (this.token && !this.user) {
        try {
          const response = await api.get('/user/me', {
            headers: { Authorization: `Bearer ${this.token}` }
          })
          this.user = response.data
        } catch (error) {
          this.logout()
        }
      }
    }
  },

  getters: {
    isAdmin: (state) => state.user?.tipos?.includes('ROLE_ADMIN') || false,
    isAuthenticated: (state) => !!state.token
  }
})
