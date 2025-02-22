<template>
  <q-page class="flex flex-center bg-grey-2">
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
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  transition: transform 0.3s;
}

.login-card:hover {
  transform: translateY(-5px);
}

.logo {
  width: 180px;
  height: auto;
}
</style>
