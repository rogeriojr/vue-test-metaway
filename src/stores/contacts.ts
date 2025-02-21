import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Contact } from '@/types'

interface ContactsState {
  contacts: Contact[]
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
        const response = await api.get('/contatos')
        this.contacts = response.data
      } catch (error) {
        console.error('Failed to fetch contacts:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async createContact(contact: Omit<Contact, 'id'>) {
      try {
        const response = await api.post('/contatos', contact)
        this.contacts.push(response.data)
        return response.data
      } catch (error) {
        console.error('Failed to create contact:', error)
        throw error
      }
    },
    async updateContact(id: number, contact: Partial<Contact>) {
      try {
        const response = await api.put(`/contatos/${id}`, contact)
        const index = this.contacts.findIndex(c => c.id === id)
        if (index !== -1) this.contacts.splice(index, 1, response.data)
        return response.data
      } catch (error) {
        console.error('Failed to update contact:', error)
        throw error
      }
    }
  },
  getters: {
    filteredContacts(): Contact[] {
      return this.contacts.filter(contact =>
        contact.nome.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  }
})
