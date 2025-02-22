<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" v-for="contact in contactsStore.filteredContacts" :key="contact.id">
        <v-card>
          <v-img :src="contact.pessoa?.foto?.url" height="150" cover />
          <v-card-title>
            {{ contact.pessoa?.nome }}
            <v-icon v-if="contact.favorito" color="yellow">mdi-star</v-icon>
          </v-card-title>
          <v-card-actions>
            <v-btn icon @click="toggleFavorite(contact)">
              <v-icon>mdi-star</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useContactsStore } from '@/stores/contacts'
import type { Contato } from '@/types'

const contactsStore = useContactsStore()

onMounted(async () => {
  await contactsStore.fetchContacts()
})

const toggleFavorite = (contact: Contato) => {
  contactsStore.updateContact(contact?.id ?? 0, { favorito: !contact.favorito })
}
</script>
