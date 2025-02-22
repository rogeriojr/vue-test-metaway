import { mount } from '@cypress/vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

const pinia = createPinia()

Cypress.Commands.add('mount', (component, options = {}) => {
  return mount(component, {
    ...options,
    global: {
      plugins: [Quasar, pinia],
      ...options.global
    }
  })
})
