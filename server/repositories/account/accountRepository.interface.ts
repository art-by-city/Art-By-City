import Account from '../../core/account/account.interface'
// import Repository from '../repository.interface'

// TODO -> extend Repository<Account>

export default interface AccountRepository {
  create(username: string, password: string): Promise<Account | null>
  getByUsername(username: string): Promise<Account | null>
  get(id: string): Promise<Account | null>
  update(user: Account): Promise<Account | null>
  list(): Promise<Account[]>
}
