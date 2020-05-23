import { injectable, inject } from 'inversify'
import {
  Strategy as JwtStrategy,
  StrategyOptions,
  ExtractJwt
} from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import jwt from 'jsonwebtoken'

import { AuthenticationResult } from '../api/results/authenticationResult.interface'
import { User, UserService } from '../user'
import { AuthService } from './'

@injectable()
export default class AuthServiceImpl implements AuthService {
  private JWT_SECRET = 'TODO_REAL_JWT_SECRET'

  private strategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: this.JWT_SECRET
  }

  userService: UserService

  constructor(@inject(Symbol.for('UserService')) userService: UserService) {
    this.userService = userService
  }

  getLocalAuthenticationStrategy(): LocalStrategy {
    return new LocalStrategy(
      async (username: string, password: string, next: Function) => {
        const user = await this.userService.authenticate(username, password)

        if (!user) {
          return next(null, false, { message: 'Invalid username or password' })
        }

        return next(null, user, { message: 'Successfully authenticated' })
      }
    )
  }

  getJwtAuthenticationStrategy(): JwtStrategy {
    return new JwtStrategy(this.strategyOptions, async (jwtPayload, next) => {
      const user = await this.userService.getById(jwtPayload.id)

      if (!user) {
        return next(null, false)
      }

      return next(null, user)
    })
  }

  sign(thing: any): string {
    return jwt.sign(thing, this.JWT_SECRET)
  }

  serializeUser(user: User, callback: Function) {
    callback(null, user.id)
  }

  deserializeUser(id: string, callback: Function) {
    callback(null, { id })
  }

  login(user: User): AuthenticationResult {
    return {
      user,
      token: this.sign({ id: user.id }),
      success: true
    }
  }
}
