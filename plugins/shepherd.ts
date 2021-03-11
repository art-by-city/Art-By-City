import Vue from 'vue'
import Shepherd from 'shepherd.js'
import Tour from 'shepherd.js/src/types/tour'

type ShepherdConstructor = (...args: any[]) => Shepherd.Tour

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $shepherd: ShepherdConstructor
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $shepherd: ShepherdConstructor
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $shepherd: ShepherdConstructor
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $shepherd: ShepherdConstructor
  }
}

Vue.use({
  install (vue) {
    vue.prototype.$shepherd = (options?: Tour.TourOptions) => {
      return new Shepherd.Tour(options)
    }
  }
})
