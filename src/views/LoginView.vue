<template>
  <q-page class="flex flex-center">
    <div class="background">
      <div class="gradient-overlay"></div>
    </div>

    <q-card class="login-card q-pa-xl shadow-10">
      <q-card-section class="text-center">
        <img src="@/assets/logo-metaway.png" alt="Logo Metaway" class="logo q-mb-xl" />

        <q-form @submit.prevent="submit" class="q-gutter-y-lg">
          <q-input
            v-model="form.username"
            label="Usuário"
            outlined
            dense
            :rules="[required]"
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="form.password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            :rules="[required, validatePassword]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                @click="togglePassword"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-checkbox v-model="rememberMe" label="Lembrar credenciais" color="primary" />

          <q-btn
            type="submit"
            label="Entrar"
            color="primary"
            class="full-width q-mt-lg"
            :loading="loading"
          />
        </q-form>

        <div class="text-caption text-grey-7 q-mt-lg">Versão: {{ appVersion }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const auth = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const appVersion = import.meta.env.VITE_APP_VERSION || 'v1.0'

const form = ref({
  username: '',
  password: '',
})
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const required = (val: string) => !!val || 'Campo obrigatório'
const validatePassword = (val: string) => /^.{8,}$/.test(val) || 'Mínimo 8 caracteres'

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

async function submit() {
  loading.value = true
  try {
    await auth.login(form.value.username, form.value.password)
    router.push('/')
    $q.notify({
      type: 'positive',
      message: 'Login realizado com sucesso!',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Credenciais inválidas!',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/login-background.jpg');
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #9ac1eb, #6a8db8);
  opacity: 0.8;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  transition: transform 0.3s;
  background-color: rgba(255, 255, 255, 0.9);
}

.login-card:hover {
  transform: translateY(-5px);
}

.logo {
  width: 180px;
  height: auto;
}

.text-caption {
  font-size: 12px;
  color: #666;
}
</style>
