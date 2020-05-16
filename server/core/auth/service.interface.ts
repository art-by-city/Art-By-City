import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import { AuthenticationResult } from '../api/results/authenticationResult.interface'
import User from '../user/user'

export default interface AuthService {
  getLocalAuthenticationStrategy(): LocalStrategy
  getJwtAuthenticationStrategy(): JwtStrategy
  sign(thing: any): string
  serializeUser(user: User, callback: Function): void
  deserializeUser(userId: string, callback: Function): void
  login(user: User): AuthenticationResult
}
