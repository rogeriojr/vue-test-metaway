<template>
  <v-container class="fill-height">
    <v-card width="400" class="mx-auto elevation-12">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.username"
            label="Usuário"
            prepend-icon="mdi-account"
            :rules="[required]"
          />

          <v-text-field
            v-model="form.password"
            label="Senha"
            prepend-icon="mdi-lock"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            :rules="[required, validatePassword]"
          />

          <v-checkbox v-model="rememberMe" label="Lembrar credenciais" />

          <v-btn type="submit" color="primary" block>Entrar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const form = ref({
  username: '',
  password: '',
})
const rememberMe = ref(false)
const showPassword = ref(false)

const required = (v: string) => !!v || 'Campo obrigatório'
const validatePassword = (v: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v) || 'Mínimo 8 caracteres com letras e números'

const submit = async () => {
  auth.rememberMe = rememberMe.value
  try {
    await auth.login(form.value.username, form.value.password)
    router.push('/')
  } catch (error) {
    alert('Login falhou! Verifique suas credenciais.')
  }
}
</script>
