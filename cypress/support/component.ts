import type { VueWrapper, mount } from '@vue/test-utils'
import { Component, ComponentOptions } from 'vue'

declare global {
  namespace Cypress {
    interface Chainable {
      qMount: (
        component: Component | ComponentOptions,
        options?: Parameters<typeof mount>[1]
      ) => Chainable<VueWrapper<any>>
    }
  }
}
