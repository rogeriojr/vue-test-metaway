import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import { Dark } from 'quasar'

import type { App } from 'vue'
import type { Plugin } from 'vue'

export default (app: App) => {
  app.use(Quasar as Plugin, {
    config: {
      brand: {
        primary: '#1976d2',
        secondary: '#26A69A',
        accent: '#9C27B0',
        dark: '#1D1D1D',
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037'
      },
      dark: false
    },
    plugins: { Notify },
    components: {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      all: true as any
    },
    directives: {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      all: true as any
    }
  })
}


Dark.set(false)
