import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { createVuetify } from 'vuetify'

export default createVuetify({
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          background: 'rgb(27, 27, 31)',
          surface: 'rgb(22, 22, 24)',
        },
      },
    },
  },
})
