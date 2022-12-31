import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import Arweave from 'arweave'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

import { memoize } from '~/app/util'
import { SignerFactory } from '~/app/infra/arweave'

const MAX_RETRIES = 1

export class ArtByCityClient {
  private api!: AxiosInstance
  private retries: number = 0

  constructor(private context: Context) {
    this.api = axios.create({
      baseURL: context.$config.artByCity.nodeUrl
    })

    this.api.interceptors.request.use(
      this.interceptRequest.bind(this),
      error => Promise.reject(error)
    )

    this.api.interceptors.response.use(
      response => response,
      this.interceptResponseError.bind(this)
    )
  }

  private async interceptRequest(
    config: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    config.headers = await this.setAuthHeaders(config.headers)

    return config
  }

  private async interceptResponseError(error: AxiosError) {
    const { response, config } = error
    if (401 === response?.status) {
      if (this.retries < MAX_RETRIES) {
        config.headers = await this.setAuthHeaders(config.headers)
        this.retries++

        return this.api(config)
      } else {
        this.retries = 0

        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }

  private async setAuthHeaders(headers: any): Promise<any> {
    const pk = await window.arweaveWallet.getActivePublicKey()
    const jwt = await this.refreshJwt()

    headers = {
      ...headers,
      Authorization: `${pk} ${jwt}`
    }

    return headers
  }

  @memoize({
    /* @dev: JWT are valid for 10 minutes */
    maxAge: 60 * 10 * 1000,
    promise: true,
    preFetch: true
  })
  private async refreshJwt(): Promise<string> {
    const signer = await SignerFactory.create()
    const header = { alg: 'PS256', typ: 'JWT' }
    const encodedHeader = Arweave.utils.stringToB64Url(JSON.stringify(header))
    const iat = Math.floor(Date.now() / 1000)
    const payload = { iat, exp: iat + 600 /* 10 minutes */ }
    const encodedPayload = Arweave.utils.stringToB64Url(JSON.stringify(payload))
    const input = `${encodedHeader}.${encodedPayload}`
    const signatureBytes = await signer.sign(Buffer.from(input))
    const signature = Arweave.utils.bufferTob64Url(signatureBytes)

    return `${input}.${signature}`
  }

  async linkIdentity(payload: {
    arweavePublicKey: string
    foreignAddress: string,
    network: string,
    verificationReq: string,
    signature: string
  }) {
    const {
      data,
      status,
      statusText
    } = await this.api.post('/identity/link', payload)

    console.log('$artbycity.linkIdentity()', data, status, statusText)
  }
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $artbycity: ArtByCityClient
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $artbycity: ArtByCityClient
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $artbycity: ArtByCityClient
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $artbycity: ArtByCityClient
  }
}

export default (context: Context, inject: Inject) => {
  try {
    inject('artbycity', new ArtByCityClient(context))
  } catch (error) {
    console.error('Error during ArtByCity plugin bootstrap', error)
  }
}
