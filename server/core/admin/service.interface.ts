import ApiServiceResult from '../api/results/apiServiceResult.interface'
import User from '../user/user'

export default interface AdminService {
  listUsers(): Promise<User[]>
  setUserRoles(userId: string, roles: string[]): Promise<ApiServiceResult<void>>
}
