<template>
  <v-container class="fill-height d-flex align-center justify-center background-container">
    <v-card class="elevation-12 login-card" width="100%" max-width="400">
      <v-card-text class="pa-6">
        <div class="logo-container">
          <img src="@/assets/logo-metaway.png" alt="Logo Metaway" class="logo" />
        </div>
        <v-form @submit.prevent="submit" class="login-form">
          <v-text-field
            v-model="form.username"
            label="Usuário"
            prepend-icon="mdi-account"
            :rules="[required]"
            variant="outlined"
            color="primary"
            density="comfortable"
            class="mb-3 input-field"
          />

          <v-text-field
            v-model="form.password"
            label="Senha"
            prepend-icon="mdi-lock"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            :rules="[required, validatePassword]"
            variant="outlined"
            color="primary"
            density="comfortable"
            class="mb-3 input-field"
          />

          <v-checkbox
            v-model="rememberMe"
            label="Lembrar credenciais"
            color="primary"
            density="comfortable"
            class="remember-me checkbox-field"
          />

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            variant="elevated"
            class="text-button"
          >
            Entrar
          </v-btn>
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

const form = ref({ username: '', password: '' })
const rememberMe = ref(false)
const showPassword = ref(false)

const required = (v: string) => !!v || 'Campo obrigatório'
const validatePassword = (v: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v) || 'Mínimo 8 caracteres com letras e números'

async function submit() {
  auth.rememberMe = rememberMe.value
  try {
    await auth.login(form.value.username, form.value.password)
    router.push('/')
  } catch (error) {
    alert('Login falhou! Verifique suas credenciais.')
  }
}
</script>

<style scoped>
.background-container {
  background: url('https://static.vecteezy.com/ti/vetor-gratis/p1/8174212-abstrato-azul-claro-fundo-azul-claro-gradiente-fundo-com-linhas-brancas-e-ondas-gratis-vetor.jpg')
    no-repeat center center/cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  border-radius: 16px !important;
  overflow: hidden;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9);
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.logo {
  width: 150px;
}

.input-field {
  font-size: 14px;
}

.checkbox-field {
  color: #1976d2 !important;
}

.remember-me {
  margin-bottom: 15px;
}

.text-button {
  font-size: 16px;
  font-weight: bold;
}
</style>
