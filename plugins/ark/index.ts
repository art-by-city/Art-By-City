import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { ethers } from 'ethers'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

import { SignerFactory } from '~/app/infra/arweave'
import { ArkNetworkKey, ArkNetworks } from './networks'
import { ArkIdentity } from './identity'

export * from './identity'
export * from './networks'

export class ArkPlugin {
  readonly networks = ArkNetworks
  api!: AxiosInstance
  contracts: Record<ArkNetworkKey, ethers.Contract> = {
    ['ETH-MAINNET']: new ethers.Contract(
      ArkNetworks['ETH-MAINNET'].contract,
      ArkNetworks['ETH-MAINNET'].abi
    ),
    ['ETH-GOERLI']: new ethers.Contract(
      ArkNetworks['ETH-GOERLI'].contract,
      ArkNetworks['ETH-GOERLI'].abi
    )
  }

  get contractKeysAndLabels(): { key: string, label: string }[] {
    const keys = Object.keys(ArkNetworks) as ArkNetworkKey[]

    return keys.map(key => {
      return { key, label: ArkNetworks[key].label }
    })
  }

  constructor(private context: Context) {
    this.api = axios.create({
      baseURL: context.$config.ark.baseUrl
    })
  }

  async resolve(address: string): Promise<ArkIdentity | null> {
    const { data } = await this.api.get(`/v2/address/resolve/${address}`)

    return data.arweave_address
      ? data as ArkIdentity
      : null
  }

  async linkIdentity(network: ArkNetworkKey, arweaveAddress: string): Promise<{
    foreignAddress: string,
    verificationReq: string
  }> {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const foreignAddress = await signer.getAddress()

    this.contracts[network] = this.contracts[network].connect(signer)
    const { hash: verificationReq } = (
      await this.contracts[network].linkIdentity(arweaveAddress)
    ) as ethers.providers.TransactionResponse

    return {
      foreignAddress,
      verificationReq
    }
  }

  async linkIdentityOld(
    network: ArkNetworkKey,
    foreignAddress: string,
    verificationReq: string
  ): Promise<void> {
    const signer = await SignerFactory.create()
    const arweavePublicKey = signer.publicKey.toString('base64')
    const prefix = 'my pubkey for DL ARK is: '
    const message = new TextEncoder().encode(`${prefix}${arweavePublicKey}`)
    const signature = (await signer.sign(message)).toString()

    const data = {
      arweavePublicKey: this.context.$auth.user.address,
      foreignAddress,
      network,
      verificationReq,
      signature
    }

    // TODO -> post to Art By City Node
  }
}

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider
  }
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $ark: ArkPlugin
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $ark: ArkPlugin
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $ark: ArkPlugin
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $ark: ArkPlugin
  }
}

export default (context: Context, inject: Inject) => {
  try {
    inject('ark', new ArkPlugin(context))
  } catch (error) {
    console.error('Error during ARK plugin bootstrap', error)
  }
}
