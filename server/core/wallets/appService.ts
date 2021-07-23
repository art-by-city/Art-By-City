import { injectable, inject } from 'inversify'
import {
  ApiServiceResult,
  ApiServiceFailureResult,
  ApiServiceSuccessResult,
  UnauthorizedError,
  NotFoundError
} from '../api'
import { UserService } from '../user'
import { WalletsApplicationService, WalletsService } from './'
import WalletViewModel from './viewModel'

@injectable()
export default class WalletsApplicationServiceImpl
  implements WalletsApplicationService {
  private userService: UserService
  private walletsService: WalletsService

  constructor(
    @inject(Symbol.for('UserService'))
    userService: UserService,
    @inject(Symbol.for('WalletsService'))
    walletsService: WalletsService
  ) {
    this.userService = userService
    this.walletsService = walletsService
  }

  async getWalletForUser(userId: string):
    Promise<ApiServiceResult<WalletViewModel>> {
    let failedResult = new ApiServiceFailureResult<WalletViewModel>()
    const owner = await this.userService.getById(userId)

    // Sanity check that user exists
    if (!owner) {
      failedResult.errors.push(new UnauthorizedError())

      return failedResult
    }

    const serviceResult = await this.walletsService.getWalletForUser(userId)

    if (!serviceResult.errors && serviceResult.payload) {
      return new ApiServiceSuccessResult(serviceResult.payload)
    }

    return { success: false, errors: [new NotFoundError('Wallet')] }
  }
}
