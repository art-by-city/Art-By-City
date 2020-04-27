import { User } from '../../core/auth/user'
import { AuthenticationResult } from './results/authenticationResult.interface'

export default interface AuthServiceInterface {
  register(username: string, password: string): AuthenticationResult
  login(user: User): AuthenticationResult
  logout(): void
}
