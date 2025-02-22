import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Contato } from '@/types'

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
      this.loading = true
      try {
        const response = await api.get('/contato/listar')
        this.contacts = response.data
      } catch (error) {
        console.error('Failed to fetch contacts:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async createContact(contact: Omit<Contato, 'id'>) {
      try {
        const response = await api.post('/contato/salvar', contact)
        this.contacts.push(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to create contact:', error)
        throw error
      }
    },
    async updateContact(id: number, contact: Partial<Contato>) {
      try {
        const response = await api.put(`/contato/salvar/${id}`, contact)
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) this.contacts.splice(index, 1, response.data)
        return response.data
      } catch (error) {
        console.error('Failed to update contact:', error)
        throw error
      }
    },
    async deleteContact(id: number) {
      try {
        await api.delete(`/contato/remover/${id}`)
        this.contacts = this.contacts.filter(c => c.id !== id)
      } catch (error) {
        console.error('Failed to delete contact:', error)
        throw error
      }
    }
  },
  getters: {
    filteredContacts(): Contato[] {
      return this.contacts.filter(contact =>
        contact.pessoa?.nome.toLowerCase().includes(this.searchQuery.toLowerCase()))
    }
  }
})
