// src/stores/users.ts
import { defineStore } from 'pinia'
import api from '@/services/api'
import type { User, Foto, ApiResponse, AuthResponse } from '@/types'
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
        const response = await api.post<User[]>('/usuario/pesquisar', {
          termo: this.searchTerm
        })
        this.users = response.data
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(userData: Omit<User, 'id'>) {
      try {
        const response = await api.post<ApiResponse<{
          usuario: User;
          tipos: string[];
        }>>('/usuario/salvar', {
          usuario: userData,
          tipos: userData.tipos || []
        })

        const newUser = response.data.object.usuario
        this.users.push(newUser)
        return newUser
      } catch (error) {
        console.error('Erro ao criar usuário:', error)
        throw error
      }
    },

    async updateUser(user: Partial<User>) {
      try {
        const response = await api.put<ApiResponse<User>>('/usuario/atualizar', user)
        const updatedUser = response.data.object

        // Atualiza na lista de usuários
        const index = this.users.findIndex(u => u.id === updatedUser.id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }

        // Atualiza currentUser se for o mesmo usuário
        if (this.currentUser?.id === updatedUser.id) {
          this.currentUser = { ...this.currentUser, ...updatedUser }
        }

        return updatedUser
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error)
        throw error
      }
    },

    async deleteUser(userId: number) {
      try {
        await api.delete(`/usuario/${userId}`)
        this.users = this.users.filter(user => user.id !== userId)
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
        throw error
      }
    },

    async changePassword(oldPassword: string, newPassword: string) {
      const authStore = useAuthStore()
      try {
        const response = await api.post<ApiResponse<AuthResponse>>('/usuario/alterarSenha', {
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

    async fetchCurrentUser() {
      const authStore = useAuthStore()
      try {
        const response = await api.get<ApiResponse<{ usuario: User }>>(
          `/usuario/buscar/${authStore.user?.id}`
        )
        this.currentUser = response.data.object.usuario

        if (this.currentUser?.foto?.id) {
          this.currentUser.foto.url = await this.fetchPhoto(this.currentUser.foto.id)
        }
      } catch (error) {
        console.error('Erro ao buscar usuário atual:', error)
        throw error
      }
    },

    async fetchPhoto(fotoId: string): Promise<string | null> {
      try {
        const response = await api.get<Blob>(`/foto/download/${fotoId}`, {
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

        const response = await api.post<ApiResponse<Foto>>(`/foto/upload/${userId}`, formData, {
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
      return this.users.filter(user => {
        const search = this.searchTerm.toLowerCase()
        return (
          (user.nome?.toLowerCase().includes(search)) ||
          (user.username?.toLowerCase().includes(search)) ||
          (user.email?.toLowerCase().includes(search))
        )
      })
    }
  }
})
