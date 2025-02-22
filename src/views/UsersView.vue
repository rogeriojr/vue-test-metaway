<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-text-field
          v-model="usersStore.searchTerm"
          label="Pesquisar Usuários"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mr-4"
        />
        <v-btn color="primary" @click="openDialog">
          <v-icon left>mdi-plus</v-icon>Novo Usuário
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="usersStore.filteredUsers"
        :loading="usersStore.loading"
        class="elevation-1"
      >
        <template v-slot:item.tipos="{ item }">
          <v-chip v-for="tipo in item.tipos" :key="tipo" class="ma-1">
            {{ tipo }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>

      <ConfirmationDialog v-model="dialog" :user="editedItem" @save="saveUser" />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import type { User } from '@/types'

const usersStore = useUsersStore()
const dialog = ref(false)
const editedItem = ref<Partial<User> | null>(null)

const headers = [
  { title: 'Usuário', value: 'username' },
  { title: 'Nome', value: 'nome' },
  { title: 'Tipo', value: 'tipos' },
  { title: 'Ações', value: 'actions', sortable: false },
]

onMounted(() => {
  usersStore.fetchUsers()
})

const openDialog = () => {
  editedItem.value = null
  dialog.value = true
}

const editItem = (item: User) => {
  editedItem.value = { ...item }
  dialog.value = true
}

const deleteItem = (item: User) => {
  console.log(item)
  // TO DO : Implementar a lógica de exclusão aqui
}

const saveUser = async (user: User) => {
  if (user.id) {
    await usersStore.updateUser(user)
  } else {
    // TO DO :Implementar criação de usuário
  }
  dialog.value = false
}
</script>
