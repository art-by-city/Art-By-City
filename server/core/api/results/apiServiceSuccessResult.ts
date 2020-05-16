import ApiServiceResult from './apiServiceResult.interface'

export default class ApiServiceSuccessResult<T> implements ApiServiceResult<T> {
  success = true
  payload?: T | null | undefined

  constructor(payload?: T) {
    this.payload = payload
  }
}
