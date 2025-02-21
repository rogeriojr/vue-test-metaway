<template>
  <v-app>
    <!-- Barra de navegação -->
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

    <!-- Conteúdo principal -->
    <v-main>
      <router-view></router-view>
      <!-- Aqui as rotas serão renderizadas -->
    </v-main>

    <!-- Snackbar para mensagens globais -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    // Verifica se o usuário está autenticado
    const isAuthenticated = computed(() => userStore.isAuthenticated)

    // Verifica se o usuário é admin (exemplo)
    const isAdmin = computed(() => userStore.user?.role === 'admin')

    // Snackbar para mensagens globais
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success',
    })

    // Função para logout
    const logout = () => {
      userStore.logout()
      router.push('/login')
      showSnackbar('Logout realizado com sucesso!', 'success')
    }

    // Função para exibir mensagens no snackbar
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
/* Estilos específicos para o App.vue */
</style>
