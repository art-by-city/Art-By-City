import { ContractInteraction, HandlerResult } from 'warp-contracts'

export function ContractAssert(cond: boolean, message: any): asserts cond {
  if (!(cond)) {
    throw new ContractError(message)
  }
}

export class ContractError extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'ContractError'
  }
}


export interface UsernamesContractState {
  usernames: {
    [owner: string]: string
  }
}

const MIN_USERNAME_LENGTH = 2
const MAX_USERNAME_LENGTH = 64
const ALLOWED_CHARS = /^[a-z0-9_\.]+$/

export type UsernamesContractInput = {
  function: 'register'
  username: string
} | {
  function: 'release'
}
export type UsernamesContractResult = any
export function handle(
  state: UsernamesContractState,
  action: ContractInteraction<UsernamesContractInput>
): HandlerResult<UsernamesContractState, UsernamesContractResult> {
  if (action.input.function === 'register') {
    const username = action.input.username

    ContractAssert(typeof username === 'string', 'username must be a string')
    ContractAssert(
      username.length >= MIN_USERNAME_LENGTH,
      `username must be at least ${MIN_USERNAME_LENGTH} characters`
    )
    ContractAssert(
      username.length <= MAX_USERNAME_LENGTH,
      `username must be no longer than ${MAX_USERNAME_LENGTH} characters`
    )
    ContractAssert(
      ALLOWED_CHARS.test(username),
      'username must only contain lowercase letters, numbers, periods, and underscores'
    )
    ContractAssert(
      !Object.values(state.usernames).includes(username),
      'username already registered'
    )

    state.usernames[action.caller] = username

    return { state, result: true }
  }

  if (action.input.function === 'release') {
    delete state.usernames[action.caller]

    return { state, result: true }
  }

  throw new ContractError('Invalid input')
}
