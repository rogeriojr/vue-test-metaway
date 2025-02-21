<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        {{ contact?.id ? 'Editar Contato' : 'Novo Contato' }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="$emit('save', form)">
          <v-text-field v-model="form.nome" label="Nome" :rules="[required]" required />

          <v-text-field
            v-model="form.telefone"
            label="Telefone"
            v-mask="'(##) #####-####'"
            :rules="[required, validatePhone]"
          />

          <v-btn type="submit" color="primary">Salvar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Contact } from '@/types'

const props = defineProps({
  modelValue: Boolean,
  contact: Object as () => Contact | null,
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = ref(props.modelValue)
const form = ref<Partial<Contact>>(props.contact || {})

watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val
  },
)

watch(dialog, (val) => {
  emit('update:modelValue', val)
})

// Validações
const required = (v: string) => !!v || 'Campo obrigatório'
const validatePhone = (v: string) => v?.length === 15 || 'Telefone inválido'
</script>
