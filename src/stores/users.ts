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
        console.error('Erro ao buscar usuários:', error)
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
        console.error('Erro ao atualizar usuário:', error)
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
        console.error('Erro ao alterar senha:', error)
        throw error
      }
    },

    // user.ts (apenas a action fetchCurrentUser alterada)
    async fetchCurrentUser() {
      const authStore = useAuthStore()
      try {
        const response = await api.get(`/usuario/buscar/${authStore.user?.id}`)
        this.currentUser = response.data.object.usuario

        // Corrigido: Buscar URL da foto usando o ID da foto do usuário
        if (this.currentUser?.foto?.id) {
          this.currentUser.foto.url = await this.fetchPhoto(this.currentUser.foto.id)
        }
      } catch (error) {
        console.error('Erro ao buscar usuário atual:', error)
        throw error
      }
    },

    async fetchPhoto(fotoId: string) {
      try {
        const response = await api.get(`/foto/download/${fotoId}`, {
          responseType: 'blob'
        })
        return URL.createObjectURL(response.data)
      } catch (error) {
        console.error('Erro ao buscar foto:', error)
        return null
      }
    },

    async uploadPhoto(userId: number, file: File) {
      try {
        const formData = new FormData()
        formData.append('foto', file)
        const response = await api.post(`/foto/upload/${userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const newFoto = response.data.object
        if (this.currentUser) {
          this.currentUser.foto = {
            ...newFoto,
            url: await this.fetchPhoto(newFoto.id)
          }
        }

        return newFoto
      } catch (error) {
        console.error('Erro ao fazer upload da foto:', error)
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
