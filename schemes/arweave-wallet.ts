import {
  BaseScheme,
  RequestHandler,
  SchemeCheck,
  SchemeOptions,
  Token,
  TokenableScheme,
  TokenableSchemeOptions
} from '~auth/runtime'
import type { Auth } from '~auth/runtime'
import { PermissionType } from 'arconnect'

// TODO -> Extend TokenableSchemeOptions and add these
export const APP_INFO = {
  name: 'Art x By x City',
  logo: 'logo/logo_by_daliah_ammar_square.png'
}

// TODO -> Extend TokenableSchemeOptions and add these
export const APP_PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS',
  'ACCESS_PUBLIC_KEY'
]

type ArweaveWalletSchemeOptions = {} & TokenableSchemeOptions
const DEFAULTS: ArweaveWalletSchemeOptions = {
  name: 'arweave',
  token: {
    property: 'token',
    required: true,
    type: false,
    name: 'Arweave',
    maxAge: false,
    global: true,
    prefix: '_token.',
    expirationPrefix: '_token_expiration.'
  },
  endpoints: {
    login: false,
    logout: '/',
    user: false
  }
}

const TOKEN = DEFAULTS.token.prefix + DEFAULTS.name

export class ArweaveWalletNotInstalledError extends Error {
  constructor() {
    super('Arweave Wallet extension not installed')
    this.name = 'ArweaveWalletNotInstalledError'
  }
}

export default class ArweaveWalletScheme<
    OptionsT extends TokenableSchemeOptions = TokenableSchemeOptions
  >
  extends BaseScheme<OptionsT>
  implements TokenableScheme<OptionsT> {

  public token: Token
  public requestHandler: RequestHandler

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

    this.token = new Token(this, this.$auth.$storage)

    this.requestHandler = new RequestHandler(this, this.$auth.ctx.$axios)
  }

  check(checkStatus = false): SchemeCheck {
    const response: SchemeCheck = {
      valid: false,
      tokenExpired: false
    }

    const token = this.$auth.$storage.syncUniversal(TOKEN) || false

    if (!checkStatus) {
      response.valid = true

      return response
    }

    if (!token) {
      response.tokenExpired = true
      return response
    }

    response.valid = true

    return response
  }

  async mounted(): Promise<void> {
    const { tokenExpired } = this.check(true)

    if (tokenExpired) {
      this.$auth.reset()
    } else {
      return this.fetchUser()
    }
  }

  async login(): Promise<void> {
    this.$auth.reset()

    if (window.arweaveWallet) {
      await window.arweaveWallet.connect(
        APP_PERMISSIONS,
        APP_INFO
      )
      await this.fetchUser()
    } else {
      const error = new ArweaveWalletNotInstalledError()
      this.$auth.callOnError(error, { method: 'login' })

      return Promise.reject(error)
    }
  }

  reset(): void {
    this.$auth.setUser(null)
    this.token.reset()
  }

  async logout(): Promise<void> {
    await window.arweaveWallet.disconnect()

    return this.$auth.reset()
  }

  async fetchUser(): Promise<void> {
    let address = this.token.get() as string | false

    if (!address) {
      address = await window.arweaveWallet.getActiveAddress()
    }

    if (address) {
      this.token.set(address)
      this.$auth.$storage.setUniversal(TOKEN, address)
      this.$auth.setUser(await this.$auth.ctx.$userService.fetchUser(address))
    }
  }
}
