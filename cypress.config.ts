import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // Adicione aqui:
      require('@cypress/vue/dist/plugins').default(on, config) // Plugin oficial do Vue
      require('cypress-vuetify').default(on) // Plugin para Vuetify
      require('cypress-real-events/support').on(on) // Eventos reais do navegador
      require('@testing-library/cypress/commands') // Testing Library

      // Opcional (report de testes):
      require('cypress-fail-fast/plugin')(on, config) // Falha rápida nos testes
      require('cypress-mochawesome-reporter/plugin')(on) // Reporter HTML

      return config
    },
    env: {
      USERNAME: 'usuario_teste',
      PASSWORD: 'senha123',
      ADMIN_USER: 'admin',
      ADMIN_PASSWORD: 'admin123'
    }
  }
})
