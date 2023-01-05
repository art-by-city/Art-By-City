const abi = [
  {
    "name": "LinkIdentity",
    "inputs": [
      {"name":"evmAddress","type":"address","indexed":true},
      {"name":"arweaveAddress","type":"string","indexed":true},
      {"name":"arAddress","type":"string","indexed":false}
    ],
    "anonymous":false,
    "type":"event"
  },{
    "name":"LaunchContract",
    "inputs":[
      {"name":"network","type":"string","indexed":false}
    ],
    "anonymous":false,
    "type":"event"
  },{
    "name":"PauseState",
    "inputs":[
      {"name":"isPaused","type":"bool","indexed":false}
    ],
    "anonymous":false,
    "type":"event"
  },{
    "stateMutability":"nonpayable",
    "type":"constructor",
    "inputs":[
      {"name":"_network","type":"string"},
      {"name":"_pausedContract","type":"bool"}
    ],
    "outputs":[]
  },{
    "stateMutability":"nonpayable",
    "type":"function",
    "name":"reversePauseState",
    "inputs":[
      {"name":"_pause","type":"bool"}
    ],"outputs":[],
    "gas":'41645'
  },{
    "stateMutability":"nonpayable",
    "type":"function",
    "name":"linkIdentity",
    "inputs":[
      {"name":"_arweave_address","type":"string"}
    ],
    "outputs":[],
    "gas":'15741'
  },{
    "stateMutability":"view",
    "type":"function",
    "name":"network",
    "inputs":[],
    "outputs":[
      {"name":"","type":"string"}
    ],
    "gas":'10538'
  },{
    "stateMutability":"view",
    "type":"function",
    "name":"owner",
    "inputs":[],
    "outputs":[
      {"name":"","type":"address"}
    ],
    "gas":'2550'
  },{
    "stateMutability":"view",
    "type":"function",
    "name":"pausedContract",
    "inputs":[],
    "outputs":[{"name":"","type":"bool"}],
    "gas":'2580'
  }
]

export type ArkNetworkKey =
 | 'ETH-MAINNET'
 | 'ETH-GOERLI'
 | 'AURORA-MAINNET'
 | 'AURORA-TESTNET'
 | 'BSC-TESTNET'
 | 'BSC-MAINNET'
 | 'FUJI-C-CHAIN'
 | 'AVALANCHE-MAINNET'
 | 'NEON-DEVNET'
 | 'FTM-MAINNET'
 | 'OPTIMISM-MAINNET'
 | 'ARBITRUM-MAINNET'
 | 'POLYGON-MAINNET'
 | 'EVMOS-MAINNET'
 | 'NEAR-MAINNET'
 | 'SOLANA-MAINNET'
 | 'TRON-MAINNET'

export function isEVMArkNetwork(
  network: ArkNetwork
): network is BaseEVMArkNetwork {
  return (network as BaseEVMArkNetwork).exmKey === 'EVM'
}

export function isRPCEVMArkNetwork(
  network: ArkNetwork
): network is RPCEVMArkNetwork {
  return (network as RPCEVMArkNetwork).rpcUrl !== undefined
}

type BaseArkNetwork = {
  key: ArkNetworkKey
  label: string
  exmKey: string
}
type BaseEVMArkNetwork = BaseArkNetwork & {
  contract: string
  abi: any
  exmKey: 'EVM'
}
type ChainIdEVMArkNetwork = BaseEVMArkNetwork & {
  chainId: string
}
type RPCEVMArkNetwork = BaseEVMArkNetwork & {
  rpcUrl: string
  chainId: string
  symbol: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: 18
  }
}
type ExoticArkNetwork = BaseArkNetwork
export type ArkNetwork =
  | ChainIdEVMArkNetwork
  | RPCEVMArkNetwork
  | ExoticArkNetwork

export const ArkNetworks: Record<ArkNetworkKey, ArkNetwork> = {
  'ETH-MAINNET': {
    key: 'ETH-MAINNET',
    label: 'Ethereum Mainnet',
    chainId: '0x1',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },

  'ETH-GOERLI': {
    key: 'ETH-GOERLI',
    label: 'Ethereum Goerli Testnet',
    chainId: '0x5',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },

  'AURORA-MAINNET': {
    key: 'AURORA-MAINNET',
    label: 'Aurora Mainnet',
    contract: '0xfb0200C27185185D7DEe0403D5f102ADb59B7c34',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://mainnet.aurora.dev',
    chainId: '0x4E454152',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },

  'AURORA-TESTNET': {
    key: 'AURORA-TESTNET',
    label: 'Aurora Testnet',
    contract: '0xfb0200C27185185D7DEe0403D5f102ADb59B7c34',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://testnet.aurora.dev',
    chainId: '0x4E454153',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },

  'BSC-TESTNET': {
    key: 'BSC-TESTNET',
    label: 'Binance Smart Chain Testnet',
    contract: '0x90f36C4Fc09a2AD3B62Cc6F5f2BCC769aFAcB70d',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    chainId: '0x61',
    nativeCurrency: {
      name: 'Binance',
      symbol: 'BNB',
      decimals: 18
    }
  },

  'BSC-MAINNET': {
    key: 'BSC-MAINNET',
    label: 'Binance Smart Chain Mainnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: '0x38',
    nativeCurrency: {
      name: 'Binance',
      symbol: 'BNB',
      decimals: 18
    }
  },

  'FUJI-C-CHAIN': {
    key: 'FUJI-C-CHAIN',
    label: 'Avalanche Fuji Testnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: '0xA869',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    }
  },

  'AVALANCHE-MAINNET': {
    key: 'AVALANCHE-MAINNET',
    label: 'Avalanche C-Chain',
    contract: '0xE5E0A3380811aD9380F91a6996529da0a262EcD1',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: '0xA86A',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    }
  },

  'NEON-DEVNET': {
    key: 'NEON-DEVNET',
    label: 'Neon EVM DevNet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://proxy.devnet.neonlabs.org/solana',
    chainId: '0xE9AC0CE',
    nativeCurrency: {
      name: 'NEON',
      symbol: 'NEON',
      decimals: 18
    }
  },

  'FTM-MAINNET': {
    key: 'FTM-MAINNET',
    label: 'Fantom Opera',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://rpc.ftm.tools/',
    chainId: '0xFA',
    nativeCurrency: {
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18
    }
  },

  'OPTIMISM-MAINNET': {
    key: 'OPTIMISM-MAINNET',
    label: 'Optimism',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://mainnet.optimism.io',
    chainId: '0xA',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },

  'ARBITRUM-MAINNET': {
    key: 'ARBITRUM-MAINNET',
    label: 'Arbitrum One',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    chainId: '0xA4B1',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    }
  },

  'POLYGON-MAINNET': {
    key: 'POLYGON-MAINNET',
    label: 'Polygon Mainnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://polygon-rpc.com',
    chainId: '0x89',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    }
  },

  'EVMOS-MAINNET': {
    key: 'EVMOS-MAINNET',
    label: 'Evmos',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM',
    rpcUrl: 'https://eth.bd.evmos.org:8545',
    chainId: '0x2329',
    nativeCurrency: {
      name: 'EVMOS',
      symbol: 'EVMOS',
      decimals: 18
    }
  },

  'NEAR-MAINNET': {
    key: 'NEAR-MAINNET',
    label: 'NEAR Mainnet',
    exmKey: 'EXOTIC-NEAR'
  },

  'SOLANA-MAINNET': {
    key: 'SOLANA-MAINNET',
    label: 'Solana Mainnet',
    exmKey: 'EXOTIC-SOLANA'
  },

  'TRON-MAINNET': {
    key: 'TRON-MAINNET',
    label: 'TRON Mainnet',
    exmKey: 'EXOTIC-TRON'
  },
}
