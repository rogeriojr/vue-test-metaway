<template>
  <q-dialog v-model="dialog" persistent>
    <q-card class="dialog-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-xl">
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.nome"
            label="Nome completo"
            outlined
            dense
            :rules="[required]"
            lazy-rules
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
            v-model="form.email"
            label="E-mail"
            outlined
            dense
            type="email"
            :rules="[required, validateEmail]"
          />

          <div class="row q-gutter-md justify-end">
            <q-btn label="Cancelar" color="negative" v-close-popup outline />
            <q-btn type="submit" label="Salvar" color="positive" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Contato } from '@/types'

const props = defineProps({
  modelValue: Boolean,
  contact: {
    type: Object as () => Contato | null,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const dialog = ref(props.modelValue)
const loading = ref(false)
const title = computed(() => (props.contact?.id ? 'Editar Contato' : 'Novo Contato'))

const form = ref<Partial<Contato>>({
  nome: '',
  telefone: '',
  email: '',
  pessoa: undefined,
})

watch(
  () => props.modelValue,
  (val) => {
    dialog.value = val
    if (val && props.contact) {
      form.value = { ...props.contact }
    }
  },
)

watch(dialog, (val) => {
  emit('update:modelValue', val)
})

const required = (val: string) => !!val || 'Campo obrigatório'
const validatePhone = (val: string) => val?.length === 11 || 'Telefone inválido'
const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido'

const onSubmit = async () => {
  loading.value = true
  try {
    emit('submit', form.value)
    dialog.value = false
  } catch (error) {
    console.error('Erro ao salvar:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dialog-card {
  min-width: 400px;
  max-width: 80vw;
}
</style>
