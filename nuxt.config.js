import IgnoreNotFoundExportPlugin from 'ignore-not-found-export-webpack-plugin'

export default {
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: 'blue',
    height: '5px',
    duration: 10000,
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
    '~/plugins/filters.ts'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
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
        name: process.env.APP_NAME || 'ArtByCity',
        version: process.env.APP_VERSION || 'development'
      },
      apiConfig: {
        protocol: process.env.ARWEAVE_PROTOCOL || 'http',
        host: process.env.ARWEAVE_HOST || 'localhost',
        port: process.env.ARWEAVE_PORT || 1984
      }
    },

  },
  // serverMiddleware: [{ path: '/api', handler: '~/server/server.ts' }],
  auth: {
    redirect: {
      login: '/',
      logout: '/'
    },
    strategies: {
      local: false,
      arconnect: {
        scheme: '~/schemes/arconnect'
      }
    }
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
    extend(config, ctx) {
      config.node = {
        fs: 'empty'
      }
    },
    plugins: [
      new IgnoreNotFoundExportPlugin()
    ]
  }
}
