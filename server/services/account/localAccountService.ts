import { injectable, inject } from 'inversify'

import Account from '../../core/account/account.interface'
import AccountRepository from '../../repositories/account/accountRepository.interface'
import UsernameAlreadyTakenError from '../errors/usernameAlreadyTakenError'
import UnknownError from '../errors/unknownError'
import ApiServiceResult from '../results/apiServiceResult.interface'
import AccountValidator from '../../core/validators/accountValidator'
import ValidationError from '../errors/validationError'
import UserNotFoundError from '../errors/userNotFoundError'
import AccountService from './accountService.interface'

@injectable()
export default class LocalAccountService implements AccountService {
  private accountRepository: AccountRepository

  constructor(
    @inject(Symbol.for('AccountRepository'))
    accountRepository: AccountRepository
  ) {
    this.accountRepository = accountRepository
  }

  async updatePassword(
    id: string,
    password: string
  ): Promise<ApiServiceResult> {
    const accountValidator = new AccountValidator()

    const messages = accountValidator.validatePassword(password)

    if (messages) {
      throw new ValidationError(messages)
    }
    const account = await this.accountRepository.get(id)

    if (!account) {
      throw new UserNotFoundError()
    }

    account.updatePassword(password)

    try {
      const updatedAccount = await this.accountRepository.update(account)

      if (!updatedAccount) {
        return { success: false }
      }

      return { success: true }
    } catch (error) {
      throw new UnknownError()
    }
  }

  async register(username: string, password: string): Promise<Account | null> {
    const accountValidator = new AccountValidator()

    const messages = accountValidator.validate(username, password)

    if (messages) {
      throw new ValidationError(messages)
    }

    try {
      return await this.accountRepository.create(username, password)
    } catch (error) {
      // TODO -> Other errors
      throw new UsernameAlreadyTakenError()
    }
  }

  async authenticate(
    username: string,
    password: string
  ): Promise<Account | null> {
    const account = await this.accountRepository.getByUsername(username)

    if (!account || !account.verifyPassword(password)) {
      return null
    }

    return account
  }

  async getAccountById(id: string): Promise<Account | null> {
    const account = await this.accountRepository.get(id)

    if (!account) {
      return null
    }

    return account
  }

  async listAccounts(): Promise<Account[]> {
    return await this.accountRepository.list()
  }

  async setAccountRoles(
    accountId: string,
    roles: string[]
  ): Promise<ApiServiceResult> {
    const account = await this.accountRepository.get(accountId)

    if (!account) {
      return { success: false, messages: ['Account not found'] }
    }

    account.setRoles(roles)

    const savedAccount = await this.accountRepository.update(account)

    if (!savedAccount) {
      return { success: false, messages: ['Could not save account'] }
    }

    return { success: true }
  }
}
