import Entity from '../common/entity'
import { User } from '../user'

export interface ArweaveWallet {
  addresses: {
    default?: string
  }
}

export default class Wallet extends Entity {
  owner: User | null = null
  arweave?: ArweaveWallet

  setOwner(owner: User) {
    this.owner = owner
  }

  setArweaveWallet(arweave: ArweaveWallet) {
    this.arweave = arweave
  }
}
