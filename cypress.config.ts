import { defineConfig } from 'cypress'
import { loadEnv } from 'vite'
import { quasar } from '@quasar/vite-plugin'


const env = loadEnv('test', process.cwd(), '')
const cypressEnv = require('./cypress.env.json')

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000',
    setupNodeEvents(on, config) {

      require('@cypress/vue/dist/plugins').default(on, config)
      require('cypress-real-events/support').on(on)
      require('@testing-library/cypress/commands')
      require('cypress-fail-fast/plugin')(on, config)
      require('cypress-mochawesome-reporter/plugin')(on)

      config.env = {
        ...config.env,
        VITE_API_URL: env.VITE_API_URL,
        ...cypressEnv
      }

      quasar({
        sassVariables: 'src/css/quasar.variables.sass'
      })

      return config
    },
    env: {
      ...cypressEnv,
      API_URL: env.VITE_API_URL,
      coverage: {
        url: `${env.VITE_API_URL}/__coverage__`
      }
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    experimentalRunAllSpecs: true
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Relatório de Testes',
    embeddedScreenshots: true,
    inlineAssets: true
  }
})
