import { ContractError } from './contractError'

export function ContractAssert(cond: boolean, message: any) {
  if (!cond) {
    throw new ContractError(message)
  }
}
