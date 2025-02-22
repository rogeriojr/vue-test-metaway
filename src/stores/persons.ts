import { defineStore } from 'pinia'
import api from '@/services/api'
import type { Person, Endereco } from '@/types'

interface PersonsState {
  persons: Person[]
  searchTerm: string
  loading: boolean
}

export const usePersonsStore = defineStore('persons', {
  state: (): PersonsState => ({
    persons: [],
    searchTerm: '',
    loading: false
  }),
  actions: {
    async fetchPersons() {
      this.loading = true
      try {
        const response = await api.post('/pessoa/pesquisar', { nome: this.searchTerm })
        this.persons = response.data
      } catch (error) {
        console.error('Error fetching persons:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async savePerson(person: Partial<Person>) {
      try {
        const response = await api.post('/pessoa/salvar', person)
        return response.data.object
      } catch (error) {
        console.error('Error saving person:', error)
        throw error
      }
    },

    async deletePerson(id: number) {
      try {
        await api.delete(`/pessoa/remover/${id}`)
        this.persons = this.persons.filter(p => p.id !== id)
      } catch (error) {
        console.error('Error deleting person:', error)
        throw error
      }
    },

    async uploadPhoto(personId: number, file: File) {
      const formData = new FormData()
      formData.append('foto', file)
      try {
        const response = await api.post(`/foto/upload/${personId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data.object
      } catch (error) {
        console.error('Error uploading photo:', error)
        throw error
      }
    }
  }
})
