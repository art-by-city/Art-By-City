import { injectable, inject } from 'inversify'
import {
  Strategy as JwtStrategy,
  StrategyOptions,
  ExtractJwt
} from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import jwt from 'jsonwebtoken'

import Account from '../../core/account/account.interface'
import AccountService from '../account/accountService.interface'
import { AuthenticationResult } from '../results/authenticationResult.interface'
import AuthServiceInterface from './authService.interface'

@injectable()
export default class AuthService implements AuthServiceInterface {
  private JWT_SECRET = 'TODO_REAL_JWT_SECRET'

  private strategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: this.JWT_SECRET
  }

  accountService: AccountService

  constructor(
    @inject(Symbol.for('AccountService')) accountService: AccountService
  ) {
    this.accountService = accountService
  }

  getLocalAuthenticationStrategy(): LocalStrategy {
    return new LocalStrategy(
      async (username: string, password: string, next: Function) => {
        const account = await this.accountService.authenticate(
          username,
          password
        )

        if (!account) {
          return next(null, false, { message: 'Invalid username or password' })
        }

        return next(null, account, { message: 'Successfully authenticated' })
      }
    )
  }

  getJwtAuthenticationStrategy(): JwtStrategy {
    return new JwtStrategy(this.strategyOptions, async (jwtPayload, next) => {
      const user = await this.accountService.getAccountById(jwtPayload.id)

      if (!user) {
        return next(null, false)
      }

      return next(null, user)
    })
  }

  sign(thing: any): string {
    return jwt.sign(thing, this.JWT_SECRET)
  }

  serializeAccount(user: Account, callback: Function) {
    callback(null, user.id)
  }

  deserializeAccount(id: string, callback: Function) {
    callback(null, { id })
  }

  login(account: Account): AuthenticationResult {
    return {
      account,
      token: this.sign({ id: account.id }),
      success: true
    }
  }
}
