<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white" v-if="isAuthenticated">
      <q-toolbar>
        <q-toolbar-title>Minha Agenda</q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>

    <NavBar v-if="isAuthenticated" />

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog
      v-model="snackbar.show"
      :class="`bg-${snackbar.color}`"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section>
          {{ snackbar.message }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.token !== null)

const snackbar = ref({ show: false, message: '', color: 'positive' })

onMounted(async () => {
  if (authStore.token) {
    try {
      await authStore.fetchUserData()
    } catch (error) {
      authStore.logout()
      router.push('/login')
    }
  }
})
</script>
