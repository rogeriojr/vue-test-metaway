<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 600px">
      <q-card-section>
        <div class="text-h6">{{ contact.id ? 'Editar Contato' : 'Novo Contato' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div class="row items-center q-gutter-sm">
            <q-avatar v-if="contact.photoUrl" size="80px">
              <img :src="contact.photoUrl" alt="Foto do contato" />
            </q-avatar>
            <q-file
              v-model="photoFile"
              label="Upload Foto"
              accept="image/*"
              outlined
              dense
              @update:model-value="handlePhotoUpload"
            />
          </div>

          <q-input
            v-model="contact.pessoa.nome"
            label="Nome"
            outlined
            dense
            :rules="[(val) => !!val || 'Nome é obrigatório']"
          />
          <q-input v-model="contact.pessoa.cpf" label="CPF" outlined dense mask="###.###.###-##" />

          <q-input v-model="contact.pessoa.endereco.logradouro" label="Logradouro" outlined dense />
          <q-input v-model="contact.pessoa.endereco.numero" label="Número" outlined dense />
          <q-input
            v-model="contact.pessoa.endereco.cep"
            label="CEP"
            outlined
            dense
            mask="#####-###"
          />
          <q-input v-model="contact.pessoa.endereco.bairro" label="Bairro" outlined dense />
          <q-input v-model="contact.pessoa.endereco.cidade" label="Cidade" outlined dense />
          <q-input v-model="contact.pessoa.endereco.estado" label="Estado" outlined dense />
          <q-input v-model="contact.pessoa.endereco.pais" label="País" outlined dense />

          <q-select
            v-model="contact.tipoContato"
            label="Tipo de Contato"
            :options="tipoContatoOptions"
            outlined
            dense
            emit-value
            map-options
          />
          <q-input
            v-model="contact.telefone"
            label="Telefone"
            outlined
            dense
            mask="(##) #####-####"
          />
          <q-input v-model="contact.email" label="Email" outlined dense type="email" />

          <q-select v-model="contact.tag" label="Categoria" :options="tagOptions" outlined dense />
          <q-checkbox v-model="contact.privado" label="Privado" />
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
import type { Contato } from '@/types'
import { useContactsStore } from '@/stores/contacts'

const tipoContatoOptions = ['CELULAR', 'TELEFONE', 'EMAIL'] as const
const tagOptions = ['Comercial', 'Particular', 'Principal', 'Residencial', 'WhatsApp']

const props = defineProps({
  modelValue: Boolean,
  contact: {
    type: Object as () => Partial<Contato>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const contactsStore = useContactsStore()
const dialog = ref(props.modelValue)
const photoFile = ref<File | null>(null)

// Objeto padrão para garantir a estrutura completa
const defaultContact: Partial<Contato> = {
  pessoa: {
    nome: '',
    cpf: '',
    endereco: {
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      pais: '',
    },
  },
  tipoContato: 'CELULAR',
  tag: '',
  privado: false,
  usuario: {
    id: -1,
    username: '',
  },
}

const contact = ref<Partial<Contato>>({ ...defaultContact })

watch(
  () => props.modelValue,
  (value) => {
    dialog.value = value
  },
)

watch(
  () => props.contact,
  (value) => {
    // Mescla o contato recebido com os valores padrão
    contact.value = {
      ...defaultContact,
      ...value,
      pessoa: {
        ...defaultContact.pessoa,
        ...value.pessoa,
        endereco: {
          ...defaultContact.pessoa?.endereco,
          ...value.pessoa?.endereco,
        },
      },
    }
  },
  { deep: true, immediate: true },
)

const handlePhotoUpload = async (file: File) => {
  if (contact.value.id) {
    const uploadedPhoto = await contactsStore.uploadPhoto(contact.value.id, file)
    if (uploadedPhoto) {
      contact.value.photoUrl = uploadedPhoto.url
    }
  }
}

const onSubmit = () => {
  emit('save', contact.value)
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
