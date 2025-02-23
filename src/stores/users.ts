import { defineStore } from 'pinia'
import api from '@/services/api'
import type { User } from '@/types'
import { useAuthStore } from './auth'

interface UsersState {
  users: User[]
  searchTerm: string
  loading: boolean
  currentUser: User | null
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    searchTerm: '',
    loading: false,
    currentUser: null
  }),
  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const response = await api.post('/usuario/pesquisar', { termo: this.searchTerm })
        this.users = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(user: Partial<User>) {
      try {
        const response = await api.put('/usuario/atualizar', user)
        return response.data.object
      } catch (error) {
        console.error('Error updating user:', error)
        throw error
      }
    },

    async changePassword(oldPassword: string, newPassword: string) {
      const authStore = useAuthStore()
      try {
        const response = await api.post('/usuario/alterarSenha', {
          username: authStore.user?.username,
          password: oldPassword,
          newPassword
        })
        return response.data
      } catch (error) {
        console.error('Error changing password:', error)
        throw error
      }
    },

    async fetchCurrentUser() {
      const authStore = useAuthStore()
      try {
        const response = await api.get(`/usuario/buscar/${authStore.user?.id}`)
        this.currentUser = response.data.object.usuario
      } catch (error) {
        console.error('Error fetching current user:', error)
        throw error
      }
    }
  },
  getters: {
    filteredUsers(): User[] {
      return this.users.filter(user =>
        user.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    }
  }
})
