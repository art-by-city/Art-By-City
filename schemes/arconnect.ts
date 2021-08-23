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
const APP_INFO = {
  name: 'Art x By x City',
  // TODO -> logo
}

// TODO -> Extend TokenableSchemeOptions and add these
const APP_PERMISSIONS = [
  'ACCESS_ADDRESS'
]

const DEFAULTS: TokenableSchemeOptions = {
  name: 'arconnect',
  token: {
    property: 'token',
    type: false,
    name: 'Arweave',
    maxAge: 1800,
    global: false,
    required: true,
    prefix: '_token.',
    expirationPrefix: '_token_expiration.'
  },
  endpoints: {
    login: false,
    logout: false,
    user: false
  }
}

export class ArConnectNotInstalledError extends Error {
  constructor() {
    super('ArConnect not installed')
    this.name = 'ArConnectNotInstalledError'
  }
}

export interface ArweaveUser {
  address: string | boolean
}

export default class ArConnectScheme<
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

    const token = this.token.sync()

    if (!token) {
      return response
    }

    if (!checkStatus) {
      response.valid = true

      return response
    }

    const tokenStatus = this.token.status()

    if (tokenStatus.expired()) {
      response.tokenExpired = true

      return response
    }

    response.valid = true

    return response
  }

  mounted(): Promise<void> {
    const { tokenExpired } = this.check(true)

    if (tokenExpired) {
      this.$auth.reset()
    }

    return this.fetchUser()
  }

  async login(): Promise<void> {
    this.$auth.reset()

    if (window.arweaveWallet) {
      await window.arweaveWallet.connect(
        APP_PERMISSIONS as PermissionType[],
        APP_INFO
      )
      await this.fetchUser()
    } else {
      const error = new ArConnectNotInstalledError()

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
    const user: ArweaveUser = {
      address: this.token.get()
    }

    if (!user.address) {
      user.address = await window.arweaveWallet.getActiveAddress()
    }

    this.token.set(user.address)
    this.$auth.setUser(user)
  }
}
