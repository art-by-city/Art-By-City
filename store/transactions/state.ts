import { UserTransaction } from '~/app/ui'

export const DEFAULT_STATE = {
  transactions: [] as UserTransaction[]
}

const state = () => ({ ...DEFAULT_STATE })

export type TransactionStoreState = ReturnType<typeof state>

export default state
