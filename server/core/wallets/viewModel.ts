import ViewModel from '../api/viewModel'
import { UserViewModel } from '../user'

export default interface WalletViewModel extends ViewModel {
  owner: UserViewModel | null
  arweave?: {
    addresses: {
      default?: string
    }
  }
}
