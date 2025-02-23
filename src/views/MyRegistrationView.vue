<template>
  <q-page class="q-pa-md">
    <q-card class="q-ma-md custom-card">
      <div v-if="auth.user?.tipos?.includes('ADMIN')" class="admin-logo">
        <q-avatar size="80px" class="q-mb-sm">
          <img :src="logo" alt="MetaWay Logo" />
        </q-avatar>
      </div>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-form @submit.prevent="save" class="q-gutter-y-lg">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="form.nome"
                    label="Nome completo"
                    outlined
                    dense
                    :rules="[required]"
                  />
                </div>

                <div class="col-12">
                  <q-input v-model="form.username" label="Usuário" outlined dense disable />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.cpf"
                    label="CPF"
                    outlined
                    dense
                    mask="###.###.###-##"
                    unmasked-value
                    :rules="[required, validateCPF]"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.email"
                    label="E-mail"
                    type="email"
                    outlined
                    dense
                    :rules="[required, validateEmail]"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="form.telefone"
                    label="Telefone"
                    outlined
                    dense
                    mask="(##) #####-####"
                    unmasked-value
                    :rules="[required, validatePhone]"
                  />
                </div>

                <div class="col-12 col-md-6">
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
                </div>
              </div>

              <q-btn
                type="submit"
                color="primary"
                label="Salvar Alterações"
                :loading="loading"
                class="full-width q-mt-lg"
                size="md"
              />
            </q-form>

            <q-separator class="q-my-lg" />

            <q-form @submit.prevent="changePassword" class="q-gutter-y-lg">
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
                size="md"
              />
            </q-form>
          </div>

          <!-- Logo lateral para desktop -->
          <div v-if="auth.user?.tipos?.includes('ADMIN')" class="col-md-4 gt-sm flex flex-center">
            <q-avatar size="200px" class="desktop-logo">
              <img :src="logo" alt="MetaWay Logo" />
            </q-avatar>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useQuasar } from 'quasar'
import logo from '@/assets/logo-metaway.png'

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
      position: 'top-right',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar dados!',
      icon: 'error',
      position: 'top-right',
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
      position: 'top-right',
    })

    oldPassword.value = ''
    newPassword.value = ''
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao alterar senha!',
      icon: 'error',
      position: 'top-right',
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
.custom-card {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  overflow: visible;
  position: relative;
}

.admin-logo {
  position: absolute;
  top: -40px;
  right: -40px;
  z-index: 2;
  transition: transform 0.3s ease;
  background: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.admin-logo:hover {
  transform: scale(1.05) rotate(-5deg);
}

.desktop-logo {
  border: 3px solid #1976d2;
  padding: 8px;
  background: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.q-separator {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 2rem 0;
}

.q-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.q-btn--loading {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .admin-logo {
    top: -30px;
    right: -30px;
  }

  .admin-logo .q-avatar {
    width: 60px;
    height: 60px;
  }

  .custom-card {
    margin: 8px;
    border-radius: 12px;
  }
}

@media (min-width: 1024px) {
  .custom-card {
    padding: 24px;
  }

  .q-card__section {
    padding: 32px;
  }
}
</style>
