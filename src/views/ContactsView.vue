<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="contactsStore.searchQuery"
          label="Pesquisar Contatos"
          prepend-inner-icon="mdi-magnify"
          clearable
        />
      </v-col>
      <v-col cols="12" md="8" class="text-right">
        <v-btn color="primary" @click="openDialog">
          <v-icon left>mdi-plus</v-icon>Novo Contato
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="contactsStore.filteredContacts"
      :loading="contactsStore.loading"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <ConfirmationDialog v-model="dialog" :contact="editedItem" @save="saveContact" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import type { Contato } from '@/types'

const contactsStore = useContactsStore()
const dialog = ref(false)
const editedItem = ref<Partial<Contato> | null>(null)

const headers = [
  { title: 'Nome', value: 'pessoa.nome' },
  { title: 'Telefone', value: 'telefone' },
  { title: 'Ações', value: 'actions', sortable: false },
]

onMounted(() => {
  contactsStore.fetchContacts()
})

const openDialog = () => {
  editedItem.value = null
  dialog.value = true
}

const editItem = (item: Contato) => {
  editedItem.value = { ...item }
  dialog.value = true
}

const deleteItem = async (item: Contato) => {
  if (confirm(`Deseja excluir ${item?.pessoa?.nome}?`)) {
    await contactsStore.deleteContact(item.id as number)
  }
}

const saveContact = async (contact: Contato) => {
  if (contact.id) {
    await contactsStore.updateContact(contact.id, contact)
  } else {
    await contactsStore.createContact(contact)
  }
  dialog.value = false
}
</script>
