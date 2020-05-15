import ApiServiceResult from '../results/apiServiceResult.interface'
import Account from '../../core/account/account.interface'

export default interface AdminService {
  listAccounts(): Promise<Account[]>
  setAccountRoles(
    accountId: string,
    roles: string[]
  ): Promise<ApiServiceResult<void>>
}
