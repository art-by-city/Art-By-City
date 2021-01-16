import { injectable, inject } from 'inversify'
import {
  Strategy as JwtStrategy,
  StrategyOptions,
  ExtractJwt
} from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import jwt from 'jsonwebtoken'

import { AuthenticationResult } from '../api/results/authenticationResult.interface'
import { UserViewModel, UserService } from '../user'
import { AuthService } from './'
import { EventService } from '../events'
import { UserEvents } from '../events/user'

@injectable()
export default class AuthServiceImpl implements AuthService {
  private JWT_SECRET = process.env.JWT_SECRET || 'THIS_IS_A_DEV_JWT_SECRET'
  private JWT_TOKEN_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN || '30m'

  private strategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: this.JWT_SECRET
  }

  private userService: UserService
  private eventService: EventService

  constructor(
    @inject(Symbol.for('UserService'))
    userService: UserService,
    @inject(Symbol.for('EventService'))
    eventService: EventService
  ) {
    this.userService = userService
    this.eventService = eventService
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
    return jwt.sign(thing, this.JWT_SECRET, { expiresIn: this.JWT_TOKEN_EXPIRES_IN })
  }

  serializeUser(user: UserViewModel, callback: Function) {
    callback(null, user.id)
  }

  deserializeUser(id: string, callback: Function) {
    callback(null, { id })
  }

  login(user: UserViewModel): AuthenticationResult {
    this.eventService.emit(UserEvents.Account.LoggedIn, user.id)

    return {
      user,
      token: this.sign({ id: user.id }),
      success: true
    }
  }
}
