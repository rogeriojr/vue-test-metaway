<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="row q-gutter-md items-center">
          <q-input
            v-model="personsStore.searchTerm"
            label="Pesquisar Pessoas"
            outlined
            dense
            clearable
            class="col-grow"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn color="primary" icon="add" label="Nova Pessoa" @click="openDialog" />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="personsStore.persons"
          :columns="columns"
          row-key="id"
          :loading="personsStore.loading"
          :pagination="pagination"
        >
          <template v-slot:body-cell-foto="props">
            <q-td :props="props">
              <q-avatar size="48px">
                <q-img
                  :src="props.row.foto?.id ? `/foto/download/${props.row.foto.id}` : defaultAvatar"
                  class="avatar-image"
                />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn icon="edit" color="primary" dense flat @click="editItem(props.row)" />
              <q-btn icon="delete" color="negative" dense flat @click="deleteItem(props.row)" />
              <q-btn
                icon="photo_camera"
                color="secondary"
                dense
                flat
                @click="openPhotoDialog(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ localForm.id ? 'Editar Pessoa' : 'Nova Pessoa' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-form @submit.prevent="savePerson" class="q-gutter-md">
            <q-input
              v-model="localForm.nome"
              label="Nome completo"
              outlined
              dense
              :rules="[required]"
            />

            <q-input
              v-model="localForm.cpf"
              label="CPF"
              outlined
              dense
              mask="###.###.###-##"
              unmasked-value
              :rules="[required, validateCPF]"
            />

            <div class="q-gutter-md">
              <q-input
                v-model="localForm.endereco.cep"
                label="CEP"
                outlined
                dense
                mask="#####-###"
                unmasked-value
                :rules="[required]"
              />

              <div class="row q-gutter-md">
                <q-input
                  v-model="localForm.endereco.logradouro"
                  label="Logradouro"
                  outlined
                  dense
                  class="col-grow"
                  :rules="[required]"
                />
                <q-input
                  v-model="localForm.endereco.numero"
                  label="Número"
                  outlined
                  dense
                  type="number"
                  class="col-3"
                  :rules="[required]"
                />
              </div>

              <div class="row q-gutter-md">
                <q-input
                  v-model="localForm.endereco.bairro"
                  label="Bairro"
                  outlined
                  dense
                  class="col"
                  :rules="[required]"
                />
                <q-input
                  v-model="localForm.endereco.cidade"
                  label="Cidade"
                  outlined
                  dense
                  class="col"
                  :rules="[required]"
                />
              </div>

              <div class="row q-gutter-md">
                <q-input
                  v-model="localForm.endereco.estado"
                  label="Estado"
                  outlined
                  dense
                  mask="AA"
                  class="col-2"
                  :rules="[required]"
                />
                <q-input
                  v-model="localForm.endereco.pais"
                  label="País"
                  outlined
                  dense
                  class="col"
                  :rules="[required]"
                />
              </div>
            </div>

            <div class="row q-mt-lg justify-end q-gutter-md">
              <q-btn label="Cancelar" color="negative" v-close-popup />
              <q-btn type="submit" label="Salvar" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="photoDialog">
      <q-card>
        <q-card-section>
          <q-file v-model="photoFile" label="Selecione uma foto" accept="image/*" outlined />
        </q-card-section>

        <q-card-actions class="justify-end q-pa-md">
          <q-btn label="Cancelar" color="negative" v-close-popup />
          <q-btn label="Enviar" color="primary" @click="uploadPhoto" :loading="uploading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { reactive, ref } from 'vue'
import { usePersonsStore } from '@/stores/persons'
import type { Person, Endereco } from '@/types'
import defaultAvatar from '@/assets/default-avatar.png'

const personsStore = usePersonsStore()
const dialog = ref(false)
const photoDialog = ref(false)
const uploading = ref(false)
const photoFile = ref<File | null>(null)
const selectedPerson = ref<Person | null>(null)

const columns = [
  { name: 'foto', label: 'Foto', field: 'foto', align: 'center' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
]

const pagination = {
  rowsPerPage: 10,
  sortBy: 'nome',
}

const initialEndereco: Endereco = {
  cep: '',
  logradouro: '',
  numero: 0,
  bairro: '',
  cidade: '',
  estado: '',
  pais: '',
}

const localForm = reactive<Partial<Person>>({
  nome: '',
  cpf: '',
  endereco: { ...initialEndereco },
})

const required = (val: string) => !!val || 'Campo obrigatório'
const validateCPF = (val: string) => {
  const cpf = val.replace(/\D/g, '')
  return cpf.length === 11 || 'CPF inválido'
}

const openDialog = () => {
  Object.assign(localForm, {
    id: undefined,
    nome: '',
    cpf: '',
    endereco: { ...initialEndereco },
  })
  dialog.value = true
}

const editItem = (person: Person) => {
  Object.assign(localForm, {
    ...person,
    endereco: person.endereco ? { ...person.endereco } : { ...initialEndereco },
  })
  dialog.value = true
}

const deleteItem = async (person: Person) => {
  if (confirm(`Deseja excluir ${person.nome}?`)) {
    await personsStore.deletePerson(person.id)
    await personsStore.fetchPersons()
  }
}

const savePerson = async () => {
  try {
    if (localForm.id) {
      await personsStore.savePerson({ ...localForm, id: localForm.id })
    } else {
      await personsStore.savePerson(localForm)
    }
    await personsStore.fetchPersons()
    dialog.value = false
  } catch (error) {
    console.error('Erro ao salvar pessoa:', error)
  }
}

const openPhotoDialog = (person: Person) => {
  selectedPerson.value = person
  photoDialog.value = true
}

const uploadPhoto = async () => {
  if (!selectedPerson.value?.id || !photoFile.value) return

  uploading.value = true
  try {
    await personsStore.uploadPhoto(selectedPerson.value.id.toString(), photoFile.value)
    await personsStore.fetchPersons()
    photoDialog.value = false
  } catch (error) {
    console.error('Erro no upload:', error)
  } finally {
    uploading.value = false
    photoFile.value = null
  }
}

onMounted(async () => {
  await personsStore.fetchPersons()
})
</script>

<style scoped>
.avatar-image {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #f0f0f0;
}

.q-avatar ::v-deep img {
  width: 100%;
  height: 100%;
}
</style>
