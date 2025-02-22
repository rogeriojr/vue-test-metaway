import { mount } from '@cypress/vue'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
import 'vuetify/styles'

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

const vuetify = createVuetify()
const pinia = createPinia()

Cypress.Commands.add('mount', (component, options = {}) => {
  return mount(component, {
    ...options,
    global: {
      plugins: [vuetify, pinia],
      ...options.global
    }
  })
})
