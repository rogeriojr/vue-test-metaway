<template>
  <v-app>
    <!-- Navigation bar -->
    <v-app-bar app color="primary" dark v-if="isAuthenticated">
      <v-toolbar-title>Minha Agenda</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/home" text>Home</v-btn>
      <v-btn to="/meu-cadastro" text>Meu Cadastro</v-btn>
      <v-btn to="/usuarios" text v-if="isAdmin">Usuários</v-btn>
      <v-btn to="/pessoas" text>Pessoas</v-btn>
      <v-btn to="/contatos" text>Contatos</v-btn>
      <v-btn @click="logout" text>Logout</v-btn>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Snackbar for global messages -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    // Check if the user is authenticated
    const isAuthenticated = computed(() => authStore.token !== null)

    // Check if the user is admin
    const isAdmin = computed(() => authStore.user?.tipos?.includes('ADMIN'))

    // Snackbar for global messages
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success',
    })

    // Logout function
    const logout = () => {
      authStore.logout()
      router.push('/login')
      showSnackbar('Logout realizado com sucesso!', 'success')
    }

    // Function to show snackbar messages
    const showSnackbar = (message: string, color: string = 'success') => {
      snackbar.value.message = message
      snackbar.value.color = color
      snackbar.value.show = true
    }

    return {
      isAuthenticated,
      isAdmin,
      snackbar,
      logout,
      showSnackbar,
    }
  },
})
</script>

<style scoped>
/* Specific styles for App.vue */
</style>
