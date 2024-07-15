import vuetify from './vuetify'
import router from '../router'
import ShortKey from 'vue3-shortkey'

import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(ShortKey)
}
