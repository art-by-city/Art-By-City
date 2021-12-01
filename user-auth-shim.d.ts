import { Auth as NuxtAuth } from '@nuxtjs/auth-next'

import { User } from '~/models'

// NB: This allows us to type User from $auth
// see https://github.com/nuxt-community/auth-module/issues/1097
declare module 'vue/types/vue' {
  interface Auth extends NuxtAuth {
    user: User & typeof NuxtAuth.prototype.user
  }
}

declare module '@nuxt/types' {
  interface Auth extends NuxtAuth {
    user: User & typeof NuxtAuth.prototype.user
  }
}

declare module 'vuex/types/index' {
  interface Auth extends NuxtAuth {
    user: User & typeof NuxtAuth.prototype.user
  }
}
