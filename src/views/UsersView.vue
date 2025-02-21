<template>
  <v-container>
    <v-data-table :headers="headers" :items="users" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="editUser(item.id)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="showUserDialog" max-width="600">
      <!-- Formulário de usuário aqui -->
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users.store'

const usersStore = useUsersStore()
const loading = ref(false)
const showUserDialog = ref(false)

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Tipo', key: 'type' },
  { title: 'Ações', key: 'actions' },
]

onMounted(async () => {
  loading.value = true
  try {
    await usersStore.fetchUsers()
  } finally {
    loading.value = false
  }
})
</script>
