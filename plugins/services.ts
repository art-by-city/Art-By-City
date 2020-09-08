import { Plugin } from '@nuxt/types'

import InvitationService from '~/services/invitation/service'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $invitationService: InvitationService
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $invitationService: InvitationService
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $invitationService: InvitationService
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $invitationService: InvitationService
  }
}

const servicesPlugin: Plugin = (context, inject) => {
  inject('invitationService', new InvitationService(context))
}

export default servicesPlugin
