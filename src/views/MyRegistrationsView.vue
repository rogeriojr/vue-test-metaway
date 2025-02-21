<template>
  <v-container class="fill-height">
    <v-card width="400">
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-text-field v-model="credentials.username" label="Usuário" outlined></v-text-field>

        <v-text-field
          v-model="credentials.password"
          label="Senha"
          type="password"
          outlined
        ></v-text-field>

        <v-checkbox v-model="rememberMe" label="Lembrar de mim"></v-checkbox>

        <v-btn color="primary" block @click="handleLogin" :loading="loading"> Entrar </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const credentials = ref({
  username: '',
  password: '',
})
const rememberMe = ref(false)
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    loading.value = true
    await authStore.login(credentials.value)
    router.push('/')
  } catch (error) {
    alert('Credenciais inválidas')
  } finally {
    loading.value = false
  }
}
</script>
