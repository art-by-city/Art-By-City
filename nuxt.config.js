import IgnoreNotFoundExportPlugin from 'ignore-not-found-export-webpack-plugin'

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const ark = {
  baseUrl: process.env.ARK_URL || 'https://ark-core.decent.land'
}

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
      href: '/logo/logo_by_daliah_ammar_square_stacked_64.png'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'white',
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
    { src: '~/plugins/ark' },
    { src: '~/plugins/smartweave.ts' },
    { src: '~/plugins/services.ts' },
    '~/plugins/components.ts',
    { src: '~/plugins/filters' },
    { src: '~/plugins/localforage.ts', ssr: false },
    { src: '~/plugins/toasts/toasts.ts' }
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
    { src: '@nuxtjs/axios', mode: 'client' },
    { src: '@nuxtjs/auth-next', mode: 'client' },
    [
      '~/modules/warp-contract-memcache',
      {
        contracts: {
          usernames: process.env.USERNAMES_CONTRACT_ID || ''
        }
      }
    ]

  ],
  serverMiddleware: [
    { path: '/node', handler: '~/server/index.ts' }
  ],
  publicRuntimeConfig: {
    baseUrl,
    ark,
    arweave: {
      app: {
        name: process.env.APP_NAME || 'ArtByCity-Development',
        version: process.env.APP_VERSION || 'development'
      },
      api: {
        protocol: process.env.ARWEAVE_PROTOCOL || 'http',
        host: process.env.ARWEAVE_HOST || 'localhost',
        port: process.env.ARWEAVE_PORT || 1984
      },
      waitForConfirmations: process.env.ARWEAVE_TX_CONFIRMATIONS || 12,
      contracts: {
        usernames: process.env.USERNAMES_CONTRACT_ID || ''
      },
      gateway: process.env.ARWEAVE_GATEWAY || 'http://localhost:1984'
    },
    artistPreregistrationUrl: process.env.ARTIST_PREREGISTRATION_URL || 'http://localhost:8081',
  },
  auth: {
    cookie: {
      name: 'arweave',
      maxAge: false,
      secure: process.env.BASE_URL === 'http://localhost:3000'
    },
    redirect: {
      logout: '/',
      login: '/',
      home: false
    },
    strategies: {
      'arweave-wallet': {
        scheme: '~/schemes/arweave-wallet.ts'
      },
      local: false
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
  proxy: {},
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
