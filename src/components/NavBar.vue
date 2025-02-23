<template>
  <q-drawer show-if-above bordered v-if="isAuthenticated">
    <div class="q-pa-md text-center">
      <img
        src="@/assets/logo-metaway.png"
        alt="Metaway Logo"
        style="max-width: 100%; height: auto"
      />
    </div>

    <q-list>
      <q-item clickable v-ripple to="/" class="q-my-sm">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>Home</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/meu-cadastro" class="q-my-sm">
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>
        <q-item-section>Meu Cadastro</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        to="/usuarios"
        class="q-my-sm"
        v-if="auth.user?.tipos?.includes('ADMIN')"
      >
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section>Usuários</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/pessoas" class="q-my-sm">
        <q-item-section avatar>
          <q-icon name="contacts" />
        </q-item-section>
        <q-item-section>Pessoas</q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/contatos" class="q-my-sm">
        <q-item-section avatar>
          <q-icon name="phone" />
        </q-item-section>
        <q-item-section>Contatos</q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="logout" class="q-my-sm text-negative">
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

<style scoped>
.q-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease;
}

.q-drawer {
  width: 250px;
}

.q-item {
  padding: 8px 16px;
}

@media (max-width: 600px) {
  .q-drawer {
    width: 100%;
  }

  .q-item {
    padding: 12px 16px;
  }
}
</style>
