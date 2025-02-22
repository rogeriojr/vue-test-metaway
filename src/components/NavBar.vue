<template>
  <q-drawer show-if-above bordered v-if="isAuthenticated">
    <q-list>
      <q-item clickable v-ripple to="/">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>Home</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/meu-cadastro">
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>
        <q-item-section>Meu Cadastro</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/usuarios" v-if="auth.user?.tipos?.includes('ADMIN')">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section>Usuários</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/pessoas">
        <q-item-section avatar>
          <q-icon name="contacts" />
        </q-item-section>
        <q-item-section>Pessoas</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/contatos">
        <q-item-section avatar>
          <q-icon name="phone" />
        </q-item-section>
        <q-item-section>Contatos</q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="logout" class="text-negative">
        <q-item-section avatar>
          <q-icon name="logout" color="negative" />
        </q-item-section>
        <q-item-section>Sair</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => auth.token !== null)

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>
