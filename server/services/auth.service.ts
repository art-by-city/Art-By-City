import AuthServiceInterface from '../interfaces/services/authService.interface'
import { AuthenticationResult } from '../interfaces/services/results/authenticationResult.interface'
import { User } from '../core/auth/user'
import { sign } from '../auth-strategies/jwt'
import UserService from '../services/user.service'

export default class LocalAuthService implements AuthServiceInterface {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  register(username: string, password: string): AuthenticationResult {
    const user = this.userService.create(username, password)

    return this.login(user)
  }

  login(user: User): AuthenticationResult {
    return { user, token: sign(user), success: true }
  }

  logout(): void {}
}
