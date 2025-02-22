<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        {{ contact?.id ? 'Editar Contato' : 'Novo Contato' }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="$emit('save', form)">
          <!-- Remove optional chaining from v-model -->
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
import type { Contato } from '@/types'

const props = defineProps({
  modelValue: Boolean,
  contact: Object as () => Contato | null,
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = ref(props.modelValue)
// Form will always be initialized with at least an empty object
const form = ref<Partial<Contato>>(props.contact || {})

watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val
  },
)

watch(dialog, (val) => {
  emit('update:modelValue', val)
})

// Validations
const required = (v: string) => !!v || 'Campo obrigatório'
const validatePhone = (v: string) => v?.length === 15 || 'Telefone inválido'
</script>
