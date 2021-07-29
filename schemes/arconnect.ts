import { BaseScheme, SchemeOptions } from '~auth/runtime'
import type { Auth } from '~auth/runtime'

const APP_INFO = {
  name: 'Art x By x City',
  // TODO -> logo
}

const DEFAULTS: SchemeOptions = {
  name: 'arconnect'
}

export interface ArweaveUser {
  address: string
}

export default class ArConnectScheme<
    OptionsT extends SchemeOptions = SchemeOptions
  > extends BaseScheme<OptionsT> {
  constructor(
    $auth: Auth,
    options: SchemeOptions,
    ...defaults: SchemeOptions[]
  ) {
    super(
      $auth,
      options as OptionsT,
      ...(defaults as OptionsT[]),
      DEFAULTS as OptionsT
    )
  }

  reset(): void {
    this.$auth.setUser(null)
  }

  async logout(): Promise<void> {
    await window.arweaveWallet.disconnect()

    return this.$auth.reset()
  }

  async fetchUser(): Promise<void> {
    const address = await window.arweaveWallet.getActiveAddress()

    this.$auth.setUser({ address })
  }

  async login(): Promise<void> {
    this.$auth.reset()

    if (window.arweaveWallet) {
      await window.arweaveWallet.connect(['ACCESS_ADDRESS'], APP_INFO)
      await this.fetchUser()
    } else {
      const error = new Error('ArConnect not installed')
      this.$auth.callOnError(error, { method: 'login' })

      return Promise.reject(error)
    }
  }
}
