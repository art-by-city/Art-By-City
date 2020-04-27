import { User } from '../../../core/auth/user'
import ApiServiceResult from './apiServiceResult.interface'

export interface AuthenticationResult extends ApiServiceResult {
  user: User
  token: string
}
