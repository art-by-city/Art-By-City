import Repository from '../repository.interface'
import User from './user'

export default interface UserRepository extends Repository<User> {
  getByUsername(username: string): Promise<User | null>
}
