import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Contato } from '@/types'
import { useAuthStore } from './auth'

interface ContactsState {
  contacts: Contato[]
  searchQuery: string
  loading: boolean
}

export const useContactsStore = defineStore('contacts', {
  state: (): ContactsState => ({
    contacts: [],
    searchQuery: '',
    loading: false
  }),
  actions: {
    async fetchContacts() {
      const authStore = useAuthStore()
      this.loading = true
      try {
        const response = await api.get(`/contato/listar/${authStore.user?.id}`)
        this.contacts = response.data
      } catch (error) {
        console.error('Error fetching contacts:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchContacts() {
      this.loading = true
      try {
        const response = await api.post('/contato/pesquisar', {
          termo: this.searchQuery
        })
        this.contacts = response.data
      } catch (error) {
        console.error('Error searching contacts:', error)
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
        this.contacts.push(response.data.object)
        return response.data.object
      } catch (error) {
        console.error('Error creating contact:', error)
        throw error
      }
    },

    async updateContact(id: number, contact: Partial<Contato>) {
      try {
        const response = await api.post('/contato/salvar', {
          ...contact,
          id
        })
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) {
          this.contacts.splice(index, 1, response.data.object)
        }
        return response.data.object
      } catch (error) {
        console.error('Error updating contact:', error)
        throw error
      }
    },

    async deleteContact(id: number) {
      try {
        await api.delete(`/contato/remover/${id}`)
        this.contacts = this.contacts.filter(c => c.id !== id)
        return true
      } catch (error) {
        console.error('Error deleting contact:', error)
        throw error
      }
    }
  },
  getters: {
    filteredContacts(): Contato[] {
      return this.contacts.filter(contact => {
        const searchLower = this.searchQuery.toLowerCase()
        return (
          contact.pessoa.nome.toLowerCase().includes(searchLower) ||
          (contact.telefone?.toLowerCase().includes(searchLower)) ||
          (contact.email?.toLowerCase().includes(searchLower)) ||
          contact.tag.toLowerCase().includes(searchLower)
        )
      })
    }
  }
})
