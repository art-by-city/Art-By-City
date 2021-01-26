import { injectable, inject } from 'inversify'
import {
  Strategy as JwtStrategy,
  StrategyOptions,
  ExtractJwt
} from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import jwt from 'jsonwebtoken'

import { AuthenticationResult } from '../api/results/authenticationResult.interface'
import { UserViewModel, UserService, User } from '../user'
import { AuthService } from './'
import { EventService } from '../events'
import { UserEvents } from '../events/user'

@injectable()
export default class AuthServiceImpl implements AuthService {
  private JWT_SECRET = process.env.JWT_SECRET || 'THIS_IS_A_DEV_JWT_SECRET'
  private JWT_TOKEN_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN || '30m'
  private JWT_REFRESH_TOKEN_EXPIRES_IN = '30d'

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

  sign(thing: any, expiresIn: string = this.JWT_TOKEN_EXPIRES_IN): string {
    return jwt.sign(thing, this.JWT_SECRET, { expiresIn })
  }

  serializeUser(user: UserViewModel, callback: Function) {
    callback(null, user.id)
  }

  deserializeUser(id: string, callback: Function) {
    callback(null, { id })
  }

  async refresh(refreshToken: string): Promise<AuthenticationResult> {
    const jwtPayload = jwt.verify(refreshToken, this.JWT_SECRET) as { id: string }
    const user = await this.userService.getById(jwtPayload.id)
    if (user) {
      const { token, refresh_token } = this.generateTokensForUser(user)

      return { user, token, refresh_token, success: true }
    } else {

    }

    throw new Error('Auth Error')
  }

  login(user: UserViewModel): AuthenticationResult {
    this.eventService.emit(UserEvents.Account.LoggedIn, user.id)

    const { token, refresh_token } = this.generateTokensForUser(user)

    return { user, token, refresh_token, success: true }
  }

  private generateTokensForUser(user: { id: string }):
    { token: string, refresh_token: string } {
    return {
      token: this.sign({ id: user.id }),
      refresh_token: this.sign(
        { id: user.id },
        this.JWT_REFRESH_TOKEN_EXPIRES_IN
      )
    }
  }
}
