// vue shim
declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

// @nuxtjs/auth-next
// see https://github.com/nuxt-community/auth-module/issues/559
declare module '~auth/runtime' {
  export { BaseScheme, SchemeOptions } from '@nuxtjs/auth-next'
  export type { Auth } from '@nuxtjs/auth-next'
}
