<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="personsStore.searchTerm"
          label="Pesquisar Pessoas"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn color="primary" @click="openDialog">
          <v-icon left>mdi-plus</v-icon>Nova Pessoa
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="personsStore.persons"
      :loading="personsStore.loading"
      class="elevation-1"
    >
      <template v-slot:item.foto="{ item }">
        <v-avatar v-if="item.foto">
          <v-img :src="`/api/foto/download/${item.foto.id}`" />
        </v-avatar>
        <v-avatar v-else color="grey-lighten-2">
          <v-icon>mdi-account</v-icon>
        </v-avatar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <ConfirmationDialog v-model="dialog" :person="editedItem" @save="savePerson" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePersonsStore } from '@/stores/persons'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import type { Person } from '@/types'

const personsStore = usePersonsStore()
const dialog = ref(false)
const editedItem = ref<Partial<Person> | null>(null)

const headers = [
  { title: 'Foto', value: 'foto', sortable: false },
  { title: 'Nome', value: 'nome' },
  { title: 'CPF', value: 'cpf' },
  { title: 'Ações', value: 'actions', sortable: false },
]

onMounted(() => {
  personsStore.fetchPersons()
})

const openDialog = () => {
  editedItem.value = null
  dialog.value = true
}

const editItem = (item: Person) => {
  editedItem.value = { ...item }
  dialog.value = true
}

const deleteItem = async (item: Person) => {
  if (confirm(`Deseja excluir ${item.nome}?`)) {
    await personsStore.deletePerson(item.id)
  }
}

const savePerson = async (person: Person) => {
  if (person.id) {
    await personsStore.savePerson(person)
  } else {
    await personsStore.savePerson(person)
  }
  dialog.value = false
}
</script>
