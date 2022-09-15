import { LoggerFactory, Warp, WarpFactory } from 'warp-contracts'

import { ContractIdsByName } from '.'

export class WarpContractMemcache {
  $warp!: Warp

  contracts: ContractIdsByName = {}

  constructor(contracts: ContractIdsByName) {
    if (process.env.NODE_ENV !== 'development') {
      LoggerFactory.INST.logLevel('fatal')
    } else {
      LoggerFactory.INST.logLevel('error')
    }

    this.$warp = process.env.NODE_ENV !== 'production'
      ? WarpFactory.forLocal()
      : WarpFactory.forMainnet()

    this.contracts = contracts
    console.log('WarpContractMemcache got contracts', this.contracts)
  }

  async readState(contractName: string): Promise<any> {
    if (!contractName || !this.contracts[contractName]) {
      throw new Error(`Contract ${contractName} not found`)
    }

    const res = await this.$warp
      .contract(this.contracts[contractName])
      .readState()

    return res.cachedValue.state
  }
}
