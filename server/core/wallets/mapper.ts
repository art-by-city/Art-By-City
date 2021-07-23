import { Wallet, WalletViewModel } from '.'
import EntityMapper from '../api/mapper'
import { UserViewModel } from '../user'
import UserMapper from '../user/mapper'

export default class WalletMapper
  implements EntityMapper<Wallet, WalletViewModel> {
  toViewModel(domainEntity: Wallet): WalletViewModel {
    return {
      owner: new UserMapper().toViewModel(domainEntity.owner),
      arweave: domainEntity.arweave
    }
  }
}
