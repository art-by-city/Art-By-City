import Account from '../../core/account/account.interface'
import ApiServiceResult from './apiServiceResult.interface'

export interface AuthenticationResult extends ApiServiceResult {
  account: Account | null
  token: string | null
}
