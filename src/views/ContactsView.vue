<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="row q-gutter-md">
          <q-input
            v-model="contactsStore.searchQuery"
            label="Pesquisar Contatos"
            outlined
            dense
            clearable
            class="col-grow"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn color="primary" @click="openDialog" icon="add" label="Novo Contato" />
          <q-btn
            color="secondary"
            @click="toggleFavorites"
            icon="star"
            :label="contactsStore.showFavorites ? 'Mostrar Todos' : 'Mostrar Favoritos'"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="contactsStore.filteredContacts"
          :columns="headers"
          :loading="contactsStore.loading"
          row-key="id"
          flat
          bordered
        >
          <template v-slot:body-cell-nome="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-avatar v-if="props.row.photoUrl">
                  <img :src="props.row.photoUrl" alt="Foto do contato" />
                </q-avatar>
                <div>
                  <div class="text-weight-bold">{{ formatName(props.row.pessoa.nome) }}</div>
                  <div v-if="props.row.privado" class="text-caption text-grey">
                    <q-icon name="lock" size="12px" /> Contato privado
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-contato="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-icon :name="contactIcon(props.row.tipoContato)" size="sm" />
                <div>
                  <div v-if="props.row.telefone">{{ formatPhone(props.row.telefone) }}</div>
                  <div v-if="props.row.email">{{ props.row.email }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-tag="props">
            <q-td :props="props">
              <q-badge :color="tagColor(props.row.tag)" class="q-pa-sm">
                {{ formatTag(props.row.tag) }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-endereco="props">
            <q-td :props="props">
              <div v-if="props.row.pessoa.endereco">
                {{ formatAddress(props.row.pessoa.endereco) }}
              </div>
              <div v-else class="text-grey">Não informado</div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn round flat color="primary" icon="edit" @click="editItem(props.row)" />
              <q-btn round flat color="negative" icon="delete" @click="deleteItem(props.row)" />
              <q-btn
                round
                flat
                :color="props.row.favorito ? 'amber' : 'grey'"
                icon="star"
                @click="toggleFavorite(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <ContactDialog v-model="dialog" :contact="editedItem" @save="saveContact" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import ContactDialog from '@/components/ContactDialog.vue'
import type { Contato } from '@/types'

const contactsStore = useContactsStore()
const dialog = ref(false)
const editedItem = ref<Partial<Contato> | null>(null)

const headers = [
  {
    name: 'nome',
    label: 'Nome',
    field: (row: Contato) => row.pessoa.nome,
    align: 'left',
    sortable: true,
  },
  {
    name: 'contato',
    label: 'Contato',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tag',
    label: 'Categoria',
    field: 'tag',
    align: 'center',
    sortable: true,
  },
  {
    name: 'endereco',
    label: 'Endereço',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Ações',
    align: 'right',
  },
]

const formatName = (name: string) => name || 'Não informado'
const formatPhone = (phone: string) =>
  phone?.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3') || 'Não informado'
const formatTag = (tag: string) =>
  tag ? tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase() : 'Sem categoria'
const formatAddress = (endereco: any) => {
  if (!endereco) return 'Não informado'
  const parts = [
    endereco.logradouro,
    endereco.numero,
    endereco.bairro,
    endereco.cidade,
    endereco.estado,
  ].filter(Boolean)
  return parts.join(', ') || 'Endereço incompleto'
}

const contactIcon = (tipo: string) => {
  return (
    {
      CELULAR: 'phone_android',
      TELEFONE: 'phone',
      EMAIL: 'email',
    }[tipo] || 'help_outline'
  )
}

const tagColor = (tag: string) => {
  const colors: { [key: string]: string } = {
    comercial: 'blue',
    particular: 'green',
    principal: 'purple',
    residencial: 'orange',
    whatsapp: 'teal',
  }
  return colors[tag.toLowerCase()] || 'grey'
}

onMounted(() => {
  contactsStore.fetchContacts()
})

const openDialog = () => {
  editedItem.value = {
    pessoa: {
      nome: '',
      cpf: '',
      endereco: {
        logradouro: '',
        numero: '',
        cep: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: '',
      },
      foto: null,
    },
    tag: '',
    email: '',
    telefone: '',
    tipoContato: '',
    privado: false,
    usuario: null,
  }
  dialog.value = true
}

const editItem = (item: Contato) => {
  editedItem.value = { ...item }
  dialog.value = true
}

const deleteItem = async (item: Contato) => {
  if (confirm(`Deseja excluir ${item?.pessoa?.nome}?`)) {
    await contactsStore.deleteContact(item.id as number)
  }
}

const toggleFavorite = async (item: Contato) => {
  await contactsStore.toggleFavorite(item)
}

const toggleFavorites = () => {
  contactsStore.toggleShowFavorites()
}

const saveContact = async (contact: Contato) => {
  if (contact.id) {
    await contactsStore.updateContact(contact.id, contact)
  } else {
    await contactsStore.createContact(contact)
  }
  dialog.value = false
}
</script>

<style scoped>
.q-table__card {
  border-radius: 8px;
}

.q-badge {
  min-width: 80px;
  justify-content: center;
}
</style>
