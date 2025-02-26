<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-xl">
      <h1 class="text-h4 text-primary q-mb-md">Meus Contatos</h1>
      <p class="text-body1">
        Gerencie todos os seus contatos em um único lugar. Adicione novos, edite existentes ou
        marque seus favoritos para acesso rápido.
      </p>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-8">
        <q-input
          v-model="contactsStore.searchQuery"
          outlined
          label="Pesquisar contatos"
          debounce="300"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-4">
        <q-btn
          color="primary"
          outline
          class="full-width"
          @click="contactsStore.showFavorites = !contactsStore.showFavorites"
          :label="contactsStore.showFavorites ? 'Mostrar todos' : 'Mostrar favoritos'"
        />
      </div>
    </div>

    <q-inner-loading :showing="contactsStore.loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

    <div class="row q-col-gutter-lg">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="contact in contactsStore.filteredContacts"
        :key="contact.id"
      >
        <q-card class="contact-card">
          <q-img
            :src="contact.photoUrl || '/default-avatar.png'"
            height="200px"
            class="contact-image"
            loading="lazy"
          >
            <template v-if="!contact.photoUrl">
              <div class="absolute-full bg-grey-4 flex flex-center">
                <q-icon name="person" size="xl" color="grey-6" />
              </div>
            </template>

            <q-badge v-if="contact.favorito" color="amber-8" class="favorite-badge">
              <q-icon name="star" size="sm" />
            </q-badge>
          </q-img>

          <q-card-section>
            <div class="text-h6 text-primary q-mb-xs">
              {{ contact.pessoa?.nome }}
            </div>
            <div class="text-caption">
              <q-icon name="category" class="q-mr-xs" />
              {{ contact.tag || 'Sem tag' }}
            </div>
            <div class="text-caption">
              <q-icon name="phone" class="q-mr-xs" />
              {{ contact.telefone || 'Não informado' }}
            </div>
            <div class="text-caption">
              <q-icon name="email" class="q-mr-xs" />
              {{ contact.email || 'Não informado' }}
            </div>
          </q-card-section>

          <q-card-actions class="q-px-md q-pb-md">
            <q-btn
              round
              flat
              :color="contact.favorito ? 'amber-8' : 'grey-6'"
              :icon="contact.favorito ? 'star' : 'star_border'"
              @click="toggleFavorite(contact)"
            />
            <q-space />
            <q-btn round flat color="primary" icon="edit" @click="openEditDialog(contact)" />
            <q-btn round flat color="negative" icon="delete" @click="deleteContact(contact)" />
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="!contactsStore.filteredContacts.length" class="col-12 text-center q-pa-xl">
        <q-icon name="contact_support" size="xl" color="grey-5" />
        <div class="text-h6 q-mt-md text-grey-6">Nenhum contato encontrado</div>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="openNewContactDialog" />
    </q-page-sticky>

    <ContactDialog
      v-model="showContactDialog"
      :contact="selectedContact"
      @submit="handleSubmit"
      @upload-photo="handlePhotoUpload"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useContactsStore } from '@/stores/contacts'
import { useAuthStore } from '@/stores/auth'
import ContactDialog from '@/components/ContactDialog.vue'
import type { Contato } from '@/types'

const $q = useQuasar()
const contactsStore = useContactsStore()
const authStore = useAuthStore()
const showContactDialog = ref(false)
const selectedContact = ref<Contato | null>(null)

onMounted(async () => {
  try {
    await authStore.initialize()

    if (authStore.isAuthenticated && authStore.user?.id) {
      await contactsStore.fetchContacts()
    }
  } catch (error) {
    $q.notify({
      message: 'Erro ao carregar contatos',
      color: 'negative',
      icon: 'error',
    })
  }
})

const toggleFavorite = async (contact: Contato) => {
  try {
    await contactsStore.toggleFavorite(contact)
    $q.notify({
      message: contact.favorito ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      color: 'positive',
      icon: 'star',
    })
  } catch (error) {
    $q.notify({
      message: 'Erro ao atualizar favoritos',
      color: 'negative',
      icon: 'error',
    })
  }
}

const openNewContactDialog = () => {
  selectedContact.value = null
  showContactDialog.value = true
}

const openEditDialog = (contact: Contato) => {
  selectedContact.value = { ...contact }
  showContactDialog.value = true
}

const deleteContact = async (contact: Contato) => {
  try {
    if (
      await $q.dialog({
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir ${contact.pessoa.nome}?`,
        cancel: true,
        persistent: true,
      })
    ) {
      await contactsStore.deleteContact(contact.id)
      $q.notify({
        message: 'Contato excluído com sucesso',
        color: 'positive',
        icon: 'check',
      })
    }
  } catch (error) {
    $q.notify({
      message: 'Erro ao excluir contato',
      color: 'negative',
      icon: 'error',
    })
  }
}

const handleSubmit = async (contactData: Partial<Contato>) => {
  try {
    if (contactData.id) {
      await contactsStore.updateContact(contactData.id, contactData)
      $q.notify({
        message: 'Contato atualizado com sucesso',
        color: 'positive',
        icon: 'check',
      })
    } else {
      await contactsStore.createContact(contactData)
      $q.notify({
        message: 'Contato criado com sucesso',
        color: 'positive',
        icon: 'check',
      })
    }
  } catch (error) {
    $q.notify({
      message: 'Erro ao salvar contato',
      color: 'negative',
      icon: 'error',
    })
  } finally {
    showContactDialog.value = false
  }
}

const handlePhotoUpload = async (file: File) => {
  if (selectedContact.value?.id) {
    try {
      await contactsStore.uploadPhoto(selectedContact.value.id, file)
      $q.notify({
        message: 'Foto atualizada com sucesso',
        color: 'positive',
        icon: 'check',
      })

      if (selectedContact.value.pessoa?.id) {
        selectedContact.value.photoUrl = await contactsStore.fetchPhoto(
          selectedContact.value.pessoa.id.toString(),
        )
      }
    } catch (error) {
      $q.notify({
        message: 'Erro ao enviar foto',
        color: 'negative',
        icon: 'error',
      })
    }
  }
}
</script>

<style scoped>
.contact-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.favorite-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 4px;
  padding: 4px 8px;
  backdrop-filter: blur(2px);
}

.contact-image {
  border-radius: 8px 8px 0 0;
  object-fit: cover;
}

.q-img__content > div {
  background-size: cover;
  background-position: center;
}
</style>
