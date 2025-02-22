<template>
  <q-page class="q-pa-md">
    <q-card class="q-ma-md">
      <q-card-section>
        <q-form @submit.prevent="save" class="q-gutter-md">
          <q-input v-model="form.nome" label="Nome completo" outlined dense :rules="[required]" />

          <q-input v-model="form.username" label="Usuário" outlined dense disable />

          <q-input
            v-model="form.cpf"
            label="CPF"
            outlined
            dense
            mask="###.###.###-##"
            unmasked-value
            :rules="[required, validateCPF]"
          />

          <q-input
            v-model="form.email"
            label="E-mail"
            type="email"
            outlined
            dense
            :rules="[required, validateEmail]"
          />

          <q-input
            v-model="form.telefone"
            label="Telefone"
            outlined
            dense
            mask="(##) #####-####"
            unmasked-value
            :rules="[required, validatePhone]"
          />

          <q-input
            v-model="form.dataNascimento"
            label="Data de Nascimento"
            outlined
            dense
            mask="##/##/####"
            :rules="[required, validateDate]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy>
                  <q-date v-model="form.dataNascimento" mask="DD/MM/YYYY" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            label="Salvar Alterações"
            :loading="loading"
            class="full-width"
          />
        </q-form>

        <q-separator class="q-my-lg" />

        <q-form @submit.prevent="changePassword" class="q-gutter-md">
          <q-input
            v-model="oldPassword"
            label="Senha Atual"
            type="password"
            outlined
            dense
            :rules="[required]"
          />

          <q-input
            v-model="newPassword"
            label="Nova Senha"
            type="password"
            outlined
            dense
            :rules="[required, validatePassword]"
          />

          <q-btn
            type="submit"
            color="primary"
            label="Alterar Senha"
            :loading="passwordLoading"
            class="full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useQuasar } from 'quasar'

const auth = useAuthStore()
const usersStore = useUsersStore()
const $q = useQuasar()

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
  dataNascimento: '',
})

const required = (val: string) => !!val || 'Campo obrigatório'
const validatePhone = (val: string) => val?.length === 11 || 'Telefone inválido'
const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido'
const validatePassword = (val: string) => /^.{8,}$/.test(val) || 'Mínimo 8 caracteres'
const validateDate = (val: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(val) || 'Data inválida'

const validateCPF = (val: string) => {
  const cpf = val.replace(/\D/g, '')

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return 'CPF inválido'

  const calcDigit = (slice: string) => {
    const numbers = slice.split('').map(Number)
    const modulus = numbers.length + 1
    const sum = numbers.reduce((acc, num, i) => acc + num * (modulus - i), 0)
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const firstNine = cpf.slice(0, 9)
  const firstDigit = calcDigit(firstNine)
  const secondDigit = calcDigit(firstNine + firstDigit)

  return cpf === firstNine + firstDigit + secondDigit || 'CPF inválido'
}

const formatBirthDate = computed(() => {
  if (!form.value.dataNascimento) return ''
  const [day, month, year] = form.value.dataNascimento.split('/')
  return `${year}-${month}-${day}`
})

const save = async () => {
  loading.value = true
  try {
    const payload = {
      ...form.value,
      dataNascimento: formatBirthDate.value,
    }

    const updatedUser = await usersStore.updateUser(payload)
    auth.user = { ...auth.user, ...updatedUser }

    $q.notify({
      type: 'positive',
      message: 'Dados atualizados com sucesso!',
      icon: 'check_circle',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar dados!',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  passwordLoading.value = true
  try {
    await usersStore.changePassword(oldPassword.value, newPassword.value)

    $q.notify({
      type: 'positive',
      message: 'Senha alterada com sucesso!',
      icon: 'check_circle',
    })

    oldPassword.value = ''
    newPassword.value = ''
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao alterar senha!',
      icon: 'error',
    })
  } finally {
    passwordLoading.value = false
  }
}

onMounted(async () => {
  if (auth.user?.id) {
    await usersStore.fetchCurrentUser()
    form.value = {
      ...form.value,
      nome: usersStore.currentUser?.nome || '',
      cpf: usersStore.currentUser?.cpf || '',
      email: usersStore.currentUser?.email || '',
      telefone: usersStore.currentUser?.telefone || '',
      dataNascimento: usersStore.currentUser?.dataNascimento
        ? new Date(usersStore.currentUser.dataNascimento).toLocaleDateString('pt-BR')
        : '',
    }
  }
})
</script>

<style scoped>
.q-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
