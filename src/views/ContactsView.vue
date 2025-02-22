<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="row q-gutter-md">
          <q-input
            v-model="contactsStore.searchQuery"
            label="Pesquisar Contatos"
            outlined
            dense
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-space />
          <q-btn color="primary" @click="openDialog" icon="add" label="Novo Contato" />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="contactsStore.filteredContacts"
          :columns="headers"
          :loading="contactsStore.loading"
          row-key="id"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round icon="edit" @click="editItem(props.row)" />
              <q-btn flat round icon="delete" @click="deleteItem(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ConfirmationDialog v-model="dialog" :contact="editedItem" @save="saveContact" />
  </q-page>
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
  { name: 'nome', label: 'Nome', field: 'pessoa.nome', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
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
