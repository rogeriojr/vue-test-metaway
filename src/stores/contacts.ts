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
        const response = await api.post('/contato/pesquisar', {
          termo: this.searchQuery
        })
        this.contacts = response.data
      } catch (error) {
        console.error('Erro ao buscar contatos:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async saveContact(contact: Partial<Contato>) {
      try {
        const response = await api.post('/contato/salvar', contact)
        return response.data.object
      } catch (error) {
        console.error('Erro ao salvar contato:', error)
        throw error
      }
    },

    async deleteContact(id: number) {
      try {
        await api.delete(`/contato/remover/${id}`)
        this.contacts = this.contacts.filter(c => c.id !== id)
      } catch (error) {
        console.error('Erro ao excluir contato:', error)
        throw error
      }
    },

    async toggleFavorite(contact: Contato) {
      try {
        const endpoint = contact.favorito
          ? `/favorito/remover/${contact.id}`
          : '/favorito/salvar'

        await api.post(endpoint, contact)
        await this.fetchContacts()
      } catch (error) {
        console.error('Erro ao atualizar favorito:', error)
        throw error
      }
    }
  },
  getters: {
    filteredContacts(): Contato[] {
      return this.contacts.filter(contact =>
        contact.pessoa?.nome?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        contact.telefone?.includes(this.searchQuery))
    }
  }
})
