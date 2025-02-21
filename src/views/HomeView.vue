<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" v-for="contato in contatos" :key="contato.id">
        <v-card>
          <v-img :src="contato.foto" height="150" cover />
          <v-card-title>
            {{ contato.nome }}
            <v-icon v-if="contato.favorito" color="yellow">mdi-star</v-icon>
          </v-card-title>
          <v-card-actions>
            <v-btn icon @click="toggleFavorito(contato)">
              <v-icon>mdi-star</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useContatosStore } from '../stores/contacts'

const contatosStore = useContatosStore()

onMounted(async () => {
  await contatosStore.carregarContatos()
})

const toggleFavorito = (contato) => {
  contatosStore.atualizarContato(contato.id, { favorito: !contato.favorito })
}
</script>
