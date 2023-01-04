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

export type ArkNetwork = {
  key: ArkNetworkKey
  label: string
  exmKey: string
  contract?: string
  abi?: any
  chainId?: string
}

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

  'AURORA-TESTNET': {
    key: 'AURORA-TESTNET',
    label: 'Aurora Testnet',
    contract: '0xfb0200C27185185D7DEe0403D5f102ADb59B7c34',
    abi,
    exmKey: 'EVM'
  },

  'AURORA-MAINNET': {
    key: 'AURORA-MAINNET',
    label: 'Aurora Mainnet',
    contract: '0xfb0200C27185185D7DEe0403D5f102ADb59B7c34',
    abi,
    exmKey: 'EVM'
  },

  'BSC-TESTNET': {
    key: 'BSC-TESTNET',
    label: 'BSC Testnet',
    contract: '0x90f36C4Fc09a2AD3B62Cc6F5f2BCC769aFAcB70d',
    abi,
    exmKey: 'EVM'
  },
  'BSC-MAINNET': {
    key: 'BSC-MAINNET',
    label: 'BSC Mainnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },
  'FUJI-C-CHAIN': {
    key: 'FUJI-C-CHAIN',
    label: 'Fuji C Chain',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },
  'AVALANCHE-MAINNET': {
    key: 'AVALANCHE-MAINNET',
    label: 'Avalanche Mainnet',
    contract: '0xE5E0A3380811aD9380F91a6996529da0a262EcD1',
    abi,
    exmKey: 'EVM'
  },
  'NEON-DEVNET': {
    key: 'NEON-DEVNET',
    label: 'NEON Devnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },
  'FTM-MAINNET': {
    key: 'FTM-MAINNET',
    label: 'FTM Mainnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },
  'OPTIMISM-MAINNET': {
    key: 'OPTIMISM-MAINNET',
    label: 'Optimism Mainnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },
  'ARBITRUM-MAINNET': {
    key: 'ARBITRUM-MAINNET',
    label: 'Arbitrum Mainnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },
  'POLYGON-MAINNET': {
    key: 'POLYGON-MAINNET',
    label: 'Polygon Mainnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
  },
  'EVMOS-MAINNET': {
    key: 'EVMOS-MAINNET',
    label: 'EVMOS Mainnet',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi,
    exmKey: 'EVM'
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
