import Vue from 'vue'
import * as Eth from 'web3-eth'
import Web3 from 'web3'
import { provider } from 'web3-core'
import * as net from 'net';

type Web3FactoryFn = (provider?: provider, net?: net.Socket) => Web3

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $web3: Web3FactoryFn
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $web3: Web3FactoryFn
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $web3: Web3FactoryFn
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $web3: Web3FactoryFn
  }
}

// declare global {
//   interface Window {
//     ethereum: provider;
//   }
// }

Vue.use({
  install (vue) {
    vue.prototype.$web3 = (provider?: provider, net?: net.Socket): Web3 => {
      if (!provider) {
        return new Web3()
      } else if (!net) {
        return new Web3(provider)
      }

      return new Web3(provider, net)
    }
  }
})
