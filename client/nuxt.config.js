const development = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: 'spa',
  head: {
    title: '...',
    titleTemplate: '%s :: Task Manager',
    link: [
      { rel: 'stylesheet', href: '//fonts.googleapis.com/icon?family=Material+Icons' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:400,700,400italic' }
    ]
  },
  axios: {
    baseURL: development ? 'http://localhost:3020/api' : '/api'
  },
  loading: { color: '#fff' },
  loadingIndicator: {
    name: 'folding-cube',
    color: '#fff',
    background: '#333'
  },
  manifest: { theme_color: '#02675d' },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxtjs/auth',
    '@nuxtjs/pwa'
  ],
  build: { extractCSS: true },
  plugins: [
   '@/plugins/material.js',
   '@/plugins/muse-ui.js',
   '@/plugins/moment.js',
   '@/plugins/i18n.js'
  ],
  toast: { duration: 4000 },
  auth: {
    resetOnError: true,
    strategies: {
      local: {
        endpoints: {
          login: { url: '/login' },
          logout: { url: '/logout' },
          user: { url: '/account' }
        }
      }
    }
  },
  router: { middleware: ['auth'] }
}
