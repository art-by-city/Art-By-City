import { injectable, inject } from 'inversify'

import { WalletsRepository, WalletsService } from '.'
import UnknownError from '../api/errors/unknownError'
import { DomainServiceResult } from '../domain'
import Wallet from './wallet'

@injectable()
export default class WalletsServiceImpl implements WalletsService {
  private walletsRepository: WalletsRepository

  constructor(
    @inject(Symbol.for('WalletsRepository'))
    walletsRepository: WalletsRepository
  ) {
    this.walletsRepository = walletsRepository
  }

  async getWalletForUser(userId: string):
    Promise<DomainServiceResult<Wallet>> {
    try {
      const wallet = await this.walletsRepository.getWalletForUser(userId)

      if (wallet) {
        return { success: true, payload: wallet }
      }
    } catch (error) {
      console.error(error)
    }

    return { success: false, errors: [new UnknownError()] }
  }
  create(wallet: Wallet): Promise<DomainServiceResult<Wallet>> {
    throw new Error('Method not implemented.')
  }
  get(walletId: string): Promise<DomainServiceResult<Wallet>> {
    throw new Error('Method not implemented.')
  }
  update(wallet: Wallet, modifyUpdated?: boolean):
    Promise<DomainServiceResult<Wallet>> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
  list(): Promise<DomainServiceResult<Wallet[]>> {
    throw new Error('Method not implemented.')
  }

}
