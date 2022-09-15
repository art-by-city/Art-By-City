import { Module } from '@nuxt/types'

import {
  SsrContextWithWarpContractMemcache,
  WarpContractMemcacheOptions
} from '.'
import { WarpContractMemcache } from './warp-contract-memcache'

export const module: Module = function (opts: WarpContractMemcacheOptions) {
  const smartweaveMemcache = new WarpContractMemcache(opts.contracts)
  this.nuxt.hook(
    'vue-renderer:ssr:prepareContext',
    (ssrContext: SsrContextWithWarpContractMemcache) => {
      console.log('WarpContractMemcache Module setting ssrContext')
      ssrContext.$smartweaveCache = smartweaveMemcache
    }
  )
}
