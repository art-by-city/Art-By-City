import { injectable } from 'inversify'
import { Collection } from 'firebase-firestorm'

import LocalAccount from '../../core/account/localAccount'
import Account from '../../core/account/account.interface'
import AccountRepository from './accountRepository.interface'

@injectable()
export default class LocalAccountRepository implements AccountRepository {
  async create(username: string, password: string): Promise<Account | null> {
    if (!(await this.getByUsername(username))) {
      // TODO -> this shouldn't be done in repository
      const account = new LocalAccount()
      account.username = username
      account.password = password

      return await Collection(LocalAccount).create(account)
    }

    throw new Error('Error creatting account: Username already taken')
  }

  async get(id: string): Promise<Account | null> {
    try {
      return await Collection(LocalAccount).get(id)
    } catch (error) {
      throw new Error(`Error getting account by id: ${error.message}`)
    }
  }

  async update(account: LocalAccount): Promise<Account | null> {
    try {
      return await Collection(LocalAccount).update(account)
    } catch (error) {
      throw new Error(`Error updating account by id: ${error.message}`)
    }
  }

  async getByUsername(username: string): Promise<Account | null> {
    try {
      const { empty, docs } = await Collection(LocalAccount)
        .query()
        .where('username', '==', username)
        .get()

      if (empty) {
        return null
      }

      return docs[0]
    } catch (error) {
      throw new Error(`Error getting account by username: ${error.message}`)
    }
  }

  async list(): Promise<Account[]> {
    try {
      const { empty, docs } = await Collection(LocalAccount)
        .query()
        .get()

      return empty ? [] : docs
    } catch (error) {
      throw new Error(`Error listing accounts: ${error.message}`)
    }
  }
}
