import { Context } from '@nuxt/types'

import { module } from './module'
import { WarpContractMemcache } from './warp-contract-memcache'

export type SsrContextWithWarpContractMemcache = Context['ssrContext'] & {
  $smartweaveCache: WarpContractMemcache
}

export type ContractIdsByName = { [name: string]: string }

export interface WarpContractMemcacheOptions {
  contracts: ContractIdsByName
}

export default module
