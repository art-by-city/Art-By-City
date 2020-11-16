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
    color: '#000000',
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
   */
  plugins: [
    '~/plugins/components.ts',
    '~/plugins/services.ts',
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
    '@nuxtjs/auth',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  serverMiddleware: [{ path: '/api', handler: '~/server/server.ts' }],
  auth: {
    redirect: {
      rewriteRedirects: true
    },
    strategies: {
      local: {
        login: {
          url: '/auth/login',
          method: 'post',
          propertyName: 'token'
        },
        logout: false,
        user: { url: '/auth/user', method: 'get', propertyName: 'user' }
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
    extend(config, ctx) {},
    plugins: [
      new IgnoreNotFoundExportPlugin()
    ]
  }
}
