import { UsernamesContractState } from '~/app/services/username/contract'

export const DEFAULT_STATE = {
  usernames: {} as UsernamesContractState['usernames']
}

const state = () => ({ ...DEFAULT_STATE })

export type UsernamesStoreState = ReturnType<typeof state>

export default state
