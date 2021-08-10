import { ContractError } from './contractError'

export function ContractAssert(cond: boolean, message: any): asserts cond {
  if (!(cond)) {
    throw new ContractError(message)
  }
}
