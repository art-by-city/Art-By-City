import ApiServiceResult from '../api/results/apiServiceResult.interface'
import User from './user'

export default interface UserService {
  register(username: string, password: string): Promise<User | null>
  authenticate(username: string, password: string): Promise<User | null>
  getById(id: string): Promise<User | null>
  updatePassword(id: string, password: string): Promise<ApiServiceResult<void>>
  listUsers(): Promise<User[]>
  setUserRoles(userId: string, roles: string[]): Promise<ApiServiceResult<void>>
}
