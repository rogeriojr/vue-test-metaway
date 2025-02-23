import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Contato, FavoritoRequest } from '@/types'
import { useAuthStore } from './auth'

interface ContactsState {
  contacts: Contato[]
  searchQuery: string
  loading: boolean
  showFavorites: boolean
}

export const useContactsStore = defineStore('contacts', {
  state: (): ContactsState => ({
    contacts: [],
    searchQuery: '',
    loading: false,
    showFavorites: false
  }),

  actions: {
    async fetchContacts() {
      const authStore = useAuthStore()
      this.loading = true
      try {
        if (!authStore.user?.id) throw new Error('Usuário não autenticado')

        const response = await api.get(`/contato/listar/${authStore.user.id}`)
        this.contacts = await Promise.all(response.data.map(async (contact: Contato) => ({
          ...contact,
          favorito: await this.checkFavorite(contact.id),
          photoUrl: contact.pessoa?.id ? await this.fetchPhoto(contact.pessoa.id) : null
        })))
      } catch (error) {
        console.error('Erro ao buscar contatos:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPhoto(fotoId: string) { // Tipo corrigido para string
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

    async checkFavorite(contactId: number) {
      const authStore = useAuthStore()
      try {
        if (!authStore.user?.id) return false

        const response = await api.get(`/favorito/pesquisar/${authStore.user.id}`)
        return response.data.some((c: Contato) => c.id === contactId)
      } catch (error) {
        console.error('Erro ao verificar favorito:', error)
        return false
      }
    },

    async toggleFavorite(contact: Contato) {
      const authStore = useAuthStore()
      try {
        if (contact.favorito) {
          await api.delete(`/favorito/remover/${contact.id}`)
        } else {
          const request: FavoritoRequest = {
            contatoId: contact.id,
            usuarioId: authStore.user!.id
          }
          await api.post('/favorito/salvar', request)
        }
        contact.favorito = !contact.favorito
      } catch (error) {
        console.error('Erro ao alternar favorito:', error)
        throw error
      }
    },

    async searchContacts() {
      this.loading = true
      try {
        const response = await api.post('/contato/pesquisar', {
          termo: this.searchQuery
        })
        this.contacts = await Promise.all(response.data.map(async (contact: Contato) => ({
          ...contact,
          favorito: await this.checkFavorite(contact.id),
          photoUrl: contact.pessoa?.id ? await this.fetchPhoto(contact.pessoa.id) : null
        })))
      } catch (error) {
        console.error('Erro na pesquisa de contatos:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createContact(contact: Partial<Contato>) {
      const authStore = useAuthStore()
      try {
        const fullContact = {
          ...contact,
          usuario: {
            id: authStore.user?.id,
            username: authStore.user?.username
          }
        }
        const response = await api.post('/contato/salvar', fullContact)
        const newContact = response.data.object
        newContact.favorito = false
        newContact.photoUrl = null
        this.contacts.push(newContact)
        return newContact
      } catch (error) {
        console.error('Erro ao criar contato:', error)
        throw error
      }
    },

    async updateContact(id: number, contact: Partial<Contato>) {
      try {
        const response = await api.post('/contato/salvar', {
          ...contact,
          id
        })
        const updatedContact = response.data.object
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts.splice(index, 1, updatedContact)
        }
        return updatedContact
      } catch (error) {
        console.error('Erro ao atualizar contato:', error)
        throw error
      }
    },

    async deleteContact(id: number) {
      try {
        await api.delete(`/contato/remover/${id}`)
        this.contacts = this.contacts.filter(c => c.id !== id)
        return true
      } catch (error) {
        console.error('Erro ao excluir contato:', error)
        throw error
      }
    },

    async uploadPhoto(contactId: number, file: File) {
      try {
        const formData = new FormData()
        formData.append('foto', file)
        const response = await api.post(`/foto/upload/${contactId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data.object
      } catch (error) {
        console.error('Erro ao enviar foto:', error)
        throw error
      }
    },

    toggleShowFavorites() {
      this.showFavorites = !this.showFavorites
    }
  },

  getters: {
    filteredContacts(): Contato[] {
      let filtered = this.contacts.filter(contact => {
        const searchLower = this.searchQuery.toLowerCase()
        return (
          contact.pessoa.nome.toLowerCase().includes(searchLower) ||
          (contact.telefone?.toLowerCase().includes(searchLower)) ||
          (contact.email?.toLowerCase().includes(searchLower)) ||
          contact.tag.toLowerCase().includes(searchLower)
        )
      })

      if (this.showFavorites) {
        filtered = filtered.filter(contact => contact.favorito)
      }

      return filtered.sort((a, b) => (b.favorito ? 1 : -1))
    }
  }
})
