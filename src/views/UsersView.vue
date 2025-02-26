<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="row q-gutter-md items-center">
          <q-input
            v-model="usersStore.searchTerm"
            label="Pesquisar Usuários"
            outlined
            dense
            clearable
            class="col-grow"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            color="primary"
            icon="add"
            label="Novo Usuário"
            @click="openDialog"
            v-if="auth.isAdmin"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="usersStore.filteredUsers"
          :columns="columns"
          row-key="id"
          :loading="usersStore.loading"
          :pagination="pagination"
        >
          <template v-slot:body-cell-tipos="props">
            <q-td :props="props">
              <q-chip
                v-for="(tipo, index) in props.row.tipos"
                :key="index"
                color="secondary"
                text-color="white"
                dense
              >
                {{ tipo }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn icon="edit" color="primary" dense flat @click="editItem(props.row)" />
              <q-btn
                icon="delete"
                color="negative"
                dense
                flat
                @click="deleteItem(props.row)"
                v-if="auth.isAdmin"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ editedItem?.id ? 'Editar Usuário' : 'Novo Usuário' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-form @submit.prevent="saveUser" class="q-gutter-md">
            <div class="row q-gutter-md">
              <q-input
                v-model="localForm.nome"
                label="Nome completo"
                outlined
                dense
                class="col-grow"
                :rules="[required]"
              />

              <q-input
                v-model="localForm.username"
                label="Usuário"
                outlined
                dense
                class="col-grow"
                :rules="[required]"
                :disable="!!editedItem?.id"
              />
            </div>

            <div class="row q-gutter-md">
              <q-input
                v-model="localForm.password"
                label="Senha"
                type="password"
                outlined
                dense
                class="col"
                :rules="[!editedItem?.id ? required : '']"
              />

              <q-input
                v-model="localForm.email"
                label="E-mail"
                type="email"
                outlined
                dense
                class="col"
                :rules="[required, validateEmail]"
              />
            </div>

            <div class="row q-gutter-md">
              <q-input
                v-model="localForm.cpf"
                label="CPF"
                outlined
                dense
                mask="###.###.###-##"
                unmasked-value
                class="col"
                :rules="[required, validateCPF]"
              />

              <q-input
                v-model="localForm.telefone"
                label="Telefone"
                outlined
                dense
                mask="(##) #####-####"
                unmasked-value
                class="col"
                :rules="[required, validatePhone]"
              />
            </div>

            <q-input
              v-model="localForm.dataNascimento"
              label="Data de Nascimento"
              outlined
              dense
              mask="##/##/####"
              :rules="[required, validateDate]"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date v-model="localForm.dataNascimento" mask="DD/MM/YYYY" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-select
              v-model="localForm.tipos"
              label="Permissões"
              outlined
              dense
              multiple
              :options="userTypes"
              :rules="[required]"
              v-if="auth.isAdmin"
            />

            <div class="row q-mt-lg justify-end q-gutter-md">
              <q-btn label="Cancelar" color="negative" v-close-popup />
              <q-btn type="submit" label="Salvar" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'

const usersStore = useUsersStore()
const auth = useAuthStore()
const dialog = ref(false)
const editedItem = ref<User | null>(null)

const columns = [
  { name: 'username', label: 'Usuário', field: 'username', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'tipos', label: 'Permissões', field: 'tipos', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
]

const pagination = {
  rowsPerPage: 10,
  sortBy: 'username',
}

const localForm = ref<Partial<User>>({
  username: '',
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  dataNascimento: '',
  password: '',
  tipos: [],
})

const userTypes = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Usuário Comum', value: 'USER' },
]

const required = (val: string) => !!val || 'Campo obrigatório'
const validateCPF = (val: string) => val?.length === 11 || 'CPF inválido'
const validatePhone = (val: string) => val?.length === 11 || 'Telefone inválido'
const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido'
const validateDate = (val: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(val) || 'Data inválida'

const openDialog = () => {
  localForm.value = {
    username: '',
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    password: '',
    tipos: [],
  }
  dialog.value = true
}

const editItem = (user: User) => {
  localForm.value = { ...user }
  dialog.value = true
}

const deleteItem = async (user: User) => {
  if (confirm(`Deseja excluir ${user.nome}?`)) {
    await usersStore.deleteUser(user.id)
    await usersStore.fetchUsers()
  }
}

const saveUser = async () => {
  try {
    if (localForm.value.id) {
      await usersStore.updateUser(localForm.value)
    }
    await usersStore.fetchUsers()
    dialog.value = false
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
  }
}

onMounted(async () => {
  await usersStore.fetchUsers()
})
</script>

<style scoped>
.q-chip {
  margin: 2px;
}
</style>
