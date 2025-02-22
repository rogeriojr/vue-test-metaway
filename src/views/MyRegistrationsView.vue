<template>
  <v-container>
    <v-card class="mx-auto" max-width="600">
      <v-card-title>Meu Cadastro</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="save">
          <v-text-field v-model="form.nome" label="Nome completo" :rules="[required]" />

          <v-text-field v-model="form.username" label="Usuário" :rules="[required]" disabled />

          <v-text-field
            v-model="form.cpf"
            label="CPF"
            v-mask="'###.###.###-##'"
            :rules="[required, validateCPF]"
          />

          <v-text-field
            v-model="form.email"
            label="E-mail"
            type="email"
            :rules="[required, validateEmail]"
          />

          <v-text-field
            v-model="form.telefone"
            label="Telefone"
            v-mask="'(##) #####-####'"
            :rules="[required, validatePhone]"
          />

          <v-btn type="submit" color="primary" :loading="loading"> Salvar Alterações </v-btn>
        </v-form>

        <v-divider class="my-4" />

        <v-form @submit.prevent="changePassword">
          <v-text-field
            v-model="oldPassword"
            label="Senha Atual"
            type="password"
            :rules="[required]"
          />

          <v-text-field
            v-model="newPassword"
            label="Nova Senha"
            type="password"
            :rules="[required, validatePassword]"
          />

          <v-btn type="submit" color="primary" :loading="passwordLoading"> Alterar Senha </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const auth = useAuthStore()
const usersStore = useUsersStore()
const loading = ref(false)
const passwordLoading = ref(false)
const oldPassword = ref('')
const newPassword = ref('')

const form = ref({
  id: auth.user?.id,
  nome: auth.user?.nome || '',
  username: auth.user?.username || '',
  cpf: auth.user?.cpf || '',
  email: auth.user?.email || '',
  telefone: auth.user?.telefone || '',
})

const required = (v: string) => !!v || 'Campo obrigatório'
const validateCPF = (v: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || 'CPF inválido'
const validatePhone = (v: string) => v?.length === 15 || 'Telefone inválido'
const validateEmail = (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido'
const validatePassword = (v: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v) || 'Mínimo 8 caracteres com letras e números'

const save = async () => {
  loading.value = true
  try {
    const updatedUser = await usersStore.updateUser(form.value)
    auth.user = { ...auth.user, ...updatedUser }
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  passwordLoading.value = true
  try {
    await usersStore.changePassword(oldPassword.value, newPassword.value)
    oldPassword.value = ''
    newPassword.value = ''
  } finally {
    passwordLoading.value = false
  }
}
</script>
