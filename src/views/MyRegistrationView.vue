<template>
  <q-page class="q-pa-md">
    <q-card class="q-ma-md custom-card">
      <div class="profile-photo-section q-pa-md flex flex-center">
        <div class="relative-position">
          <q-avatar size="120px" class="profile-photo cursor-pointer" @click="triggerFileInput">
            <img
              v-if="auth.user?.foto?.url"
              :src="auth.user.foto.url"
              alt="Foto do perfil"
              class="profile-image"
            />
            <q-icon v-else name="person" size="xl" color="grey-6" class="absolute-center" />
            <q-badge
              v-if="auth.user?.tipos?.includes('ADMIN')"
              color="primary"
              floating
              class="admin-badge"
            >
              ADMIN
            </q-badge>
          </q-avatar>
          <q-icon
            name="photo_camera"
            class="photo-upload-icon absolute-bottom-right"
            color="primary"
            size="sm"
          />
          <input ref="fileInput" type="file" accept="image/*" hidden @change="handlePhotoUpload" />
        </div>
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
const fileInput = ref<HTMLInputElement | null>(null)

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
const validatePassword = (val: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val) || 'Mínimo 8 caracteres com letras e números'
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

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    try {
      const file = input.files[0]
      const updatedFoto = await usersStore.uploadPhoto(auth.user!.id, file)

      auth.user!.foto = {
        id: updatedFoto.id,
        name: updatedFoto.name,
        type: updatedFoto.type,
        url: await usersStore.fetchPhoto(updatedFoto.id),
      }

      $q.notify({
        type: 'positive',
        message: 'Foto atualizada com sucesso!',
        icon: 'check_circle',
        position: 'top-right',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao atualizar foto!',
        icon: 'error',
        position: 'top-right',
      })
    }
  }
}

onMounted(async () => {
  if (auth.user?.id) {
    try {
      await usersStore.fetchCurrentUser()

      if (usersStore.currentUser?.foto) {
        auth.user.foto = {
          id: usersStore.currentUser.foto.id,
          name: usersStore.currentUser.foto.name,
          type: usersStore.currentUser.foto.type,
          url: usersStore.currentUser.foto.url,
        }
      }

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
    } catch (error) {
      console.log(error)
      $q.notify({
        type: 'negative',
        message: 'Erro ao carregar dados do usuário!',
        icon: 'error',
        position: 'top-right',
      })
    }
  }
})
</script>

<style scoped>
.profile-photo-section {
  position: relative;
  margin-top: -80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-photo {
  border: 4px solid white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
  background: #f5f5f5;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-upload-icon {
  background: white;
  border-radius: 50%;
  padding: 4px;
  transform: translate(25%, 25%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.custom-card {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
  overflow: visible;
  margin-top: 5vh;
}

.admin-badge {
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 6px 12px;
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
  .profile-photo-section {
    margin-top: -60px;
  }

  .profile-photo {
    width: 100px;
    height: 100px;
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

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
