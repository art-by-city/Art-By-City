import {
  ContractInteraction,
  ContractHandlerResult
} from 'smartweave/lib/contract-step'

import { ContractError, ContractAssert } from '../../environment'

export interface UsernamesContractState {
  usernames: {
    [username: string]: {
      owner: string
    }
  }
}

const RESERVED_NAMES = [
  'publish',
  'about',
  'changelog',
  'debug',
  'learn',
  'settings',
  'admin'
]

export function handle(
  state: UsernamesContractState,
  action: ContractInteraction
): ContractHandlerResult {
  if (action.input.function === 'register') {
    const username = action.input.username

    ContractAssert(typeof username === 'string', 'name must be a string')
    ContractAssert(username.length > 1, 'name must be at least 2 characters')
    ContractAssert(!RESERVED_NAMES.includes(username), 'name is reserved')
    console.log('contract', state)
    ContractAssert(!(state.usernames[username]), 'name already registered')

    // TODO -> only allow users to own 1 username at a time

    state.usernames[username] = {
      owner: action.caller
    }

    return { state }
  }

  if (action.input.function === 'update') {
    const username = action.input.username

    ContractAssert(typeof username === 'string', 'name must be a string')
    ContractAssert(username.length > 1, 'name must be at least 2 characters')
    ContractAssert(!!(state.usernames[username]), 'name not registered')
    ContractAssert(
      state.usernames[username].owner === action.caller,
      'name not owned by caller'
    )

    state.usernames[username].owner = action.caller

    return { state }
  }

  if (action.input.function === 'transfer') {
    const username = action.input.username
    const target = action.input.target

    ContractAssert(typeof username === 'string', 'name must be a string')
    ContractAssert(username.length > 1, 'name must be at least 2 characters')
    ContractAssert(
      typeof target === 'string',
      'target must be provided to transfer name to'
    )
    ContractAssert(!!(state.usernames[username]), 'name not registered')
    ContractAssert(
      state.usernames[username].owner === action.caller,
      'name not owned by caller'
    )

    state.usernames[username].owner = target

    return { state }
  }

  if (action.input.function === 'giveup') {
    const username = action.input.username

    ContractAssert(typeof username === 'string', 'name must be a string')
    ContractAssert(username.length > 1, 'name must be at least 2 characters')
    ContractAssert(!!(state.usernames[username]), 'name not registered')
    ContractAssert(
      state.usernames[username].owner === action.caller,
      'name not owned by caller'
    )

    delete state.usernames[username]

    return { state }
  }

  throw new ContractError('Invalid input')
}
