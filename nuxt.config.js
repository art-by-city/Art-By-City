import IgnoreNotFoundExportPlugin from 'ignore-not-found-export-webpack-plugin'

export default {
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s | Art By City',
    title: 'The Artist\'s Permaweb',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'Description',
        content: 'The Artist\'s Permaweb - Publish your art permanently on the blockchain'
      },
      { property: 'og:site_name', content: 'Art By City' },
      { name: 'twitter:site', content: '@artbycity' }
    ],
    link: [{
      rel: 'icon',
      type: 'image/png',
      href: 'logo/logo_by_daliah_ammar_square_stacked_64.png'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'blue',
    height: '5px',
    duration: 10000,
    continuous: true,
    throttle: 0
  },
  /*
   ** Global CSS
   */
  css: [
    '@assets/global.scss',
    '~/node_modules/cropperjs/dist/cropper.css'
  ],
  /*
   ** Plugins to load before mounting the App
   *
   *  NB: Order of plugins matters, as plugins may rely on other plugins
   */
  plugins: [
    { src: '~/plugins/arweave.ts' },
    { src: '~/plugins/ardb.ts' },
    { src: '~/plugins/services.ts' },
    '~/plugins/components.ts',
    '~/plugins/filters.ts',
    { src: '~/plugins/localforage.ts', ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    arweave: {
      appConfig: {
        name: process.env.APP_NAME || 'ArtByCity-Development',
        version: process.env.APP_VERSION || 'development'
      },
      apiConfig: {
        protocol: process.env.ARWEAVE_PROTOCOL || 'http',
        host: process.env.ARWEAVE_HOST || 'localhost',
        port: process.env.ARWEAVE_PORT || 1984
      },
      waitForConfirmations: process.env.ARWEAVE_TX_CONFIRMATIONS || 12
    },
    artistPreregistrationUrl: process.env.ARTIST_PREREGISTRATION_URL || 'http://localhost:8081'
  },
  serverMiddleware: [{ path: '/api', handler: '~/server/server.ts' }],
  auth: {
    redirect: {
      logout: '/',
      login: '/',
      home: false
    },
    strategies: {
      local: false,
      'arweave-wallet': {
        scheme: '~/schemes/arweave-wallet.ts'
      }
    },
    plugins: [
      { src: '~/plugins/persist-store.ts', ssr: false }
    ]
  },
  router: {},
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      default: 'light'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // @ts-ignore
    extend(config, _context) {
      config.node = {
        fs: 'empty'
      }
      // Exclude /contracts directory from webpack build
      config.module.rules.push({ exclude: [`${__dirname}/contracts`] })
    },
    plugins: [
      new IgnoreNotFoundExportPlugin()
    ]
  }
}
