import {
  ContractInteraction,
  ContractHandlerResult
} from 'smartweave/lib/contract-step'

import { ContractError, ContractAssert } from '../../environment'

interface UsernamesContractState {
  names: {
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
    ContractAssert(
      typeof action.input.name !== 'string',
      'name must be a string'
    )

    ContractAssert(
      action.input.name.length < 2,
      'name must be at least 2 characters'
    )

    ContractAssert(
      RESERVED_NAMES.includes(action.input.name),
      'name is reserved'
    )

    ContractAssert(
      !!(state.names[action.input.name]),
      'name already registered'
    )

    state.names[action.input.name] = {
      owner: action.caller
    }

    return { state }
  }

  // if (action.input.function === 'update') {
  //   if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
  //     throw new ContractError(`Invalid name provided: ${action.input.name}`)
  //   }
  //   if (typeof action.input.data !== 'string') {
  //     throw new ContractError('Must provide data to be associated with the name')
  //   }
  //   if (!state.names[action.input.name]) {
  //     throw new ContractError('Name not registered')
  //   }
  //   if (state.names[action.input.name].owner !== action.caller) {
  //     throw new ContractError('Name not owned by caller')
  //   }

  //   state.names[action.input.name].username = action.input.data

  //   return { state }
  // }

  // if (action.input.function === 'transfer') {
  //   if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
  //     throw new ContractError(`Invalid name provided: ${action.input.name}`)
  //   }
  //   if (typeof action.input.target !== 'string') {
  //     throw new ContractError('Must provide a target to transfer the name to')
  //   }
  //   if (!state.names[action.input.name]) {
  //     throw new ContractError('Name not registered')
  //   }
  //   if (state.names[action.input.name].owner !== action.caller) {
  //     throw new ContractError('Name not owned by caller')
  //   }

  //   state.names[action.input.name].owner = action.input.target

  //   return { state }
  // }

  // if (action.input.function === 'giveup') {
  //   if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
  //     throw new ContractError(`Invalid name provided: ${action.input.name}`)
  //   }
  //   if (!state.names[action.input.name]) {
  //     throw new ContractError('Name not registered')
  //   }
  //   if (state.names[action.input.name].owner !== action.caller) {
  //     throw new ContractError('Name not owned by caller')
  //   }

  //   delete state.names[action.input.name]

  //   return { state }
  // }

  throw new Error('Invalid input')
}
