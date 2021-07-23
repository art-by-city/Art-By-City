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
    '~/plugins/axios',
    '~/plugins/components.ts',
    '~/plugins/services.ts',
    '~/plugins/filters.ts',
    { src: '~/plugins/web3.ts', mode: 'client' },
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
    arweave: (
      process.env.NODE_ENV === 'production'
      || process.env.NODE_ENV === 'staging'
    )
      ? { protocol: 'https', host: 'arweave.net', port: 443 }
      : { protocol: 'http', host: 'localhost', port: 1984 },
    imgBaseUrl: (
      process.env.NODE_ENV === 'production'
      || process.env.NODE_ENV === 'staging'
    )
      ? `https://storage.googleapis.com/${process.env.USER_UPLOAD_BUCKET_NAME}`
      : 'http://localhost:3000'
  },
  serverMiddleware: [{ path: '/api', handler: '~/server/server.ts' }],
  auth: {
    localStorage: false,
    cookie: {
      options: {
        secure: process.env.NODE_ENV === 'production'
          || process.env.NODE_ENV === 'staging'
      }
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/',
      // callback: '/callback',
      rewriteRedirects: true,
      // resetOnError: true
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'token',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        user: { property: 'user' },
        login: { url: '/auth/login', method: 'post' },
        logout: false,
        user: { url: '/auth/user', method: 'get' }
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
