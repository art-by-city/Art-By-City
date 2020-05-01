import { injectable, inject } from 'inversify'

import ApiServiceResult from '../results/apiServiceResult.interface'
import AccountService from '../account/accountService.interface'
import Account from '../../core/account/account.interface'
import AdminServiceInterface from './adminService.interface'

@injectable()
export default class AdminService implements AdminServiceInterface {
  private accountService: AccountService

  constructor(
    @inject(Symbol.for('AccountService')) accountService: AccountService
  ) {
    this.accountService = accountService
  }

  listAccounts(): Promise<Account[]> {
    return this.accountService.listAccounts()
  }

  setAccountRoles(
    accountId: string,
    roles: string[]
  ): Promise<ApiServiceResult> {
    return this.accountService.setAccountRoles(accountId, roles)
  }
}
