const ethAbi = [
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

export type ArkNetworkKey = 'ETH-MAINNET' | 'ETH-GOERLI'

export type ArkNetwork = {
  key: ArkNetworkKey
  label: string
  contract: string
  abi: any
  chainId?: string
  exmKey: string
}

export const ArkNetworks: Record<ArkNetworkKey, ArkNetwork> = {
  'ETH-MAINNET': {
    key: 'ETH-MAINNET',
    label: 'Ethereum Mainnet',
    chainId: '0x1',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi: ethAbi,
    exmKey: 'EVM'
  },

  'ETH-GOERLI': {
    key: 'ETH-GOERLI',
    label: 'Ethereum Goerli Testnet',
    chainId: '0x5',
    contract: '0xdE44d3fB118E0f007f2C0D8fFFE98b994383949A',
    abi: ethAbi,
    exmKey: 'EVM'
  }
}
