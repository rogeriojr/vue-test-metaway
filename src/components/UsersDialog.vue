<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 600px">
      <q-card-section>
        <div class="text-h6">{{ user.id ? 'Editar Usuário' : 'Novo Usuário' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="user.nome"
            label="Nome"
            outlined
            dense
            :rules="[(val) => !!val || 'Nome é obrigatório']"
          />
          <q-input v-model="user.cpf" label="CPF" outlined dense mask="###.###.###-##" />
          <q-input
            v-model="user.dataNascimento"
            label="Data de Nascimento"
            outlined
            dense
            type="date"
          />
          <q-input v-model="user.email" label="Email" outlined dense type="email" />
          <q-input v-model="user.telefone" label="Telefone" outlined dense mask="(##) #####-####" />
          <q-input v-model="user.username" label="Username" outlined dense />
          <q-input v-model="user.password" label="Senha" outlined dense type="password" />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="negative" v-close-popup />
        <q-btn flat label="Salvar" color="primary" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/types'

const props = defineProps({
  modelValue: Boolean,
  user: {
    type: Object as () => Partial<User>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = ref(props.modelValue)
const user = ref<Partial<User>>({
  nome: '',
  cpf: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  username: '',
  password: '',
})

watch(
  () => props.modelValue,
  (value) => {
    dialog.value = value
  },
)

watch(
  () => props.user,
  (value) => {
    user.value = { ...value }
  },
  { deep: true, immediate: true },
)

const onSubmit = () => {
  emit('save', user.value)
  dialog.value = false
}
</script>

<style scoped>
.q-card {
  border-radius: 8px;
}

.q-input,
.q-select,
.q-checkbox {
  margin-bottom: 16px;
}
</style>
