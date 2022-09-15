import { Contract, LoggerFactory, Warp, WarpFactory } from 'warp-contracts'

import { ContractIdsByName } from '.'

export class WarpContractMemcache {
  $warp!: Warp

  contracts: { [contractName: string]: Contract } = {}

  constructor(contractIdsByName: ContractIdsByName) {
    if (process.env.NODE_ENV !== 'development') {
      LoggerFactory.INST.logLevel('fatal')
    } else {
      LoggerFactory.INST.logLevel('error')
    }

    this.$warp = process.env.NODE_ENV !== 'production'
      ? WarpFactory.forLocal()
      : WarpFactory.forMainnet()

    const contractNames = Object.keys(contractIdsByName)
    for (let i = 0; i < contractNames.length; i++) {
      const contractName = contractNames[i]
      const contractId = contractIdsByName[contractName]
      this.contracts[contractName] = this.$warp.contract(contractId)
      console.log(
        'WarpContractMemcache loading contract',
        contractName,
        contractId
      )
    }
  }

  async readState(contractName: string): Promise<any> {
    if (!contractName || !this.contracts[contractName]) {
      throw new Error(`Contract ${contractName} not found`)
    }

    const res = await this.contracts[contractName].readState()

    return res.cachedValue.state
  }
}
