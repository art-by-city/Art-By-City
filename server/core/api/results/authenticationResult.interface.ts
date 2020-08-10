import { UserViewModel } from '../../user'
import ApiServiceResult from './apiServiceResult.interface'

export interface AuthenticationResult extends ApiServiceResult<void> {
  user: UserViewModel | null
  token: string | null
}
