import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import Account from '../../core/account/account.interface'
import { AuthenticationResult } from '../results/authenticationResult.interface'

export default interface AuthService {
  getLocalAuthenticationStrategy(): LocalStrategy
  getJwtAuthenticationStrategy(): JwtStrategy
  sign(thing: any): string
  serializeAccount(account: Account, callback: Function): void
  deserializeAccount(accountId: string, callback: Function): void
  login(account: Account): AuthenticationResult
}
