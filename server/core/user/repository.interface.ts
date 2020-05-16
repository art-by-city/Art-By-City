import User from './user'
// import Repository from '../repository.interface'

// TODO -> extend Repository<User>

export default interface UserRepository {
  create(username: string, password: string): Promise<User | null>
  getByUsername(username: string): Promise<User | null>
  get(id: string): Promise<User | null>
  update(user: User): Promise<User | null>
  list(): Promise<User[]>
}
