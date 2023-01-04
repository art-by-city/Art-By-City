import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { ethers } from 'ethers'
import axios, { AxiosInstance } from 'axios'
import Arweave from 'arweave'

import { SignerFactory } from '~/app/infra/arweave'
import { ArkNetworkKey, ArkNetworks } from './networks'
import { ArkIdentity } from './identity'

export * from './identity'
export * from './networks'

export class ArkPlugin {
  readonly networks = ArkNetworks
  api!: AxiosInstance

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
    const id = await this.context.$artbycity.resolve(address)

    return id.arweave_address
      ? id
      : null
  }

  async linkIdentity(network: ArkNetworkKey, arweaveAddress: string) {
    const arkNetwork = ArkNetworks[network]
    if (arkNetwork.contract && arkNetwork.abi) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const foreignAddress = await signer.getAddress()
      const contract = new ethers.Contract(
        arkNetwork.contract, arkNetwork.abi
      ).connect(signer)
      const { hash: verificationReq } = (
        await contract.linkIdentity(arweaveAddress)
      ) as ethers.providers.TransactionResponse

      const {
        arweavePublicKey,
        signature
      } = await this.generateARKArweaveSignature()

      return await this.context.$artbycity.linkIdentity({
        arweavePublicKey,
        foreignAddress,
        network,
        verificationReq,
        signature
      })
    }
  }

  async unlinkIdentity(foreignAddress: string) {
    const {
      arweavePublicKey,
      signature
    } = await this.generateARKArweaveSignature()

    return await this.context.$artbycity.unlinkIdentity({
      arweavePublicKey,
      signature,
      foreignAddress
    })
  }

  async setPrimaryAddress(primary_address: string) {
    const {
      arweavePublicKey,
      signature
    } = await this.generateARKArweaveSignature()

    return await this.context.$artbycity.setPrimaryAddress({
      arweavePublicKey,
      signature,
      primary_address
    })
  }

  private async generateARKArweaveSignature() {
    const arSigner = await SignerFactory.create()
    const arweavePublicKey = Arweave.utils
      .bufferTob64Url(arSigner.publicKey)
      .substring(0, 683)
    const message = new TextEncoder().encode(
      `my pubkey for DL ARK is: ${arweavePublicKey}`
    )
    const signatureBytes = await arSigner.sign(message)
    const signature = Buffer.from(signatureBytes).toString('base64')

    return { arweavePublicKey, signature }
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
