<template>
  <q-page class="q-pa-lg">
    <div class="row q-col-gutter-lg">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="contact in contactsStore.filteredContacts"
        :key="contact.id"
      >
        <q-card class="contact-card">
          <q-img
            :src="contact.pessoa?.foto?.url || 'default-avatar.png'"
            height="200px"
            class="contact-image"
          >
            <q-badge v-if="contact.favorito" color="amber-8" class="favorite-badge">
              <q-icon name="star" size="sm" />
            </q-badge>
          </q-img>

          <q-card-section>
            <div class="text-h6 text-primary q-mb-xs">
              {{ contact.pessoa?.nome }}
            </div>
            <div class="text-caption">
              <q-icon name="phone" class="q-mr-xs" />
              {{ contact.telefone }}
            </div>
            <div class="text-caption">
              <q-icon name="email" class="q-mr-xs" />
              {{ contact.email }}
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
            <q-btn round flat color="primary" icon="edit" @click="editContact(contact)" />
            <q-btn round flat color="negative" icon="delete" @click="deleteContact(contact)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="openNewContactDialog" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'

const contactsStore = useContactsStore()

onMounted(async () => {
  await contactsStore.fetchContacts()
})

const toggleFavorite = (contact: Contato) => {
  contactsStore.toggleFavorite(contact)
}

const editContact = (contact: Contato) => {
  //TO DO: Implementar lógica de edição
}

const deleteContact = async (contact: Contato) => {
  if (confirm(`Tem certeza que deseja excluir ${contact.pessoa?.nome}?`)) {
    await contactsStore.deleteContact(contact.id as number)
  }
}

const openNewContactDialog = () => {
  //TO DO: Implementar abertura do diálogo
}
</script>

<style scoped>
.contact-card {
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.favorite-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 4px;
  padding: 4px 8px;
}

.contact-image {
  border-radius: 8px 8px 0 0;
}
</style>
