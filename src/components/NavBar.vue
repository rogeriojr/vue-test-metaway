<template>
  <v-navigation-drawer permanent>
    <v-list nav>
      <v-list-item to="/" title="Home" />
      <v-list-item to="/my-registrations" title="Meu Cadastro" />
      <v-list-item v-if="auth.user?.admin" to="/users" title="Usuários" />
      <v-list-item to="/persons" title="Pessoas" />
      <v-list-item to="/contacts" title="Contatos" />
      <v-list-item @click="logout" title="Logout" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const logout = () => {
  auth.logout()
}
</script>
