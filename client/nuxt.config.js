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
    prefix: '/api',
    proxy: true
  },
  loading: { color: '#fff' },
  loadingIndicator: {
    name: 'folding-cube',
    color: '#fff',
    background: '#333'
  },
  manifest: { theme_color: '#02675d' },
  modules: [
    ['@nuxtjs/moment', ['ru']],
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxtjs/proxy',
    '@nuxtjs/auth',
    '@nuxtjs/pwa'
  ],
  plugins: [
   '@/plugins/material.js',
   '@/plugins/muse-ui.js',
   '@/plugins/moment.js',
   '@/plugins/i18n.js'
  ],
  proxy: process.env.NODE_ENV !== 'production' && [
    'http://localhost:3020/uploads',
    'http://localhost:3020/api'
  ],
  router: { middleware: ['auth'] },
  build: { extractCSS: true },
  toast: { duration: 4000 },
  auth: {
    resetOnError: true,
    strategies: {
      local: {
        endpoints: {
          login: { url: '/login' },
          user: { url: '/account' },
          logout: false,
        }
      }
    }
  }
}
