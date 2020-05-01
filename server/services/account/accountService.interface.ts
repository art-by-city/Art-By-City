import Account from '../../core/account/account.interface'
import ApiServiceResult from '../results/apiServiceResult.interface'

export default interface AccountService {
  register(username: string, password: string): Promise<Account | null>
  authenticate(username: string, password: string): Promise<Account | null>
  getAccountById(id: string): Promise<Account | null>
  updatePassword(id: string, password: string): Promise<ApiServiceResult>
  listAccounts(): Promise<Account[]>
  setAccountRoles(accountId: string, roles: string[]): Promise<ApiServiceResult>
}
