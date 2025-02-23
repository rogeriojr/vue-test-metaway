<template>
  <q-drawer
    v-model="drawerOpen"
    show-if-above
    bordered
    :breakpoint="600"
    :width="250"
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    v-if="isAuthenticated"
  >
    <div class="q-pa-md text-center">
      <img
        src="@/assets/logo-metaway.png"
        alt="Metaway Logo"
        style="max-width: 100%; height: auto"
      />
      <div class="text-caption text-grey-7 q-mt-sm">{{ appVersion }}</div>
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

      <q-item clickable v-ripple to="/usuarios" class="q-my-sm" v-if="auth.isAdmin">
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
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const drawerOpen = defineModel<boolean>('drawerOpen', { default: false })
const miniState = ref(false)

const appVersion = import.meta.env.VITE_APP_VERSION || 'v1.0'

const isAuthenticated = computed(() => auth.token !== null)

const logout = () => {
  auth.logout()
  router.push('/login')
}

onMounted(() => {
  const storedVersion = localStorage.getItem('appVersion')

  if (storedVersion !== appVersion) {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem('appVersion', appVersion)
    window.location.reload()
  }

  if (auth.token && !auth.user) {
    auth.initialize()
  }
})
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
