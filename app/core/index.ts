export * from './artwork'
export * from './avatar'
export * from './common'
export * from './error'
export * from './feed'
export * from './likes'
export * from './profile'
export * from './tips'
export * from './user'

export type StatsSummary = {
  users: number,
  dappUsers: number,
  artists: number,
  publications: number,
  transactions: number,
  dappTransactions: number,
  likesCount: number,
  likesTotal: string,
  tipsCount: number,
  tipsTotal: string,
  networkFees: string
}
