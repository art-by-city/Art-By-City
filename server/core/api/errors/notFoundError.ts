import ApiServiceError from './apiServiceError.interface'

export default class NotFoundError implements ApiServiceError {
  statusCode = 404
  name = this.constructor.name
  message: string

  constructor(thing: any) {
    this.message = `${thing.constructor.name} not found`
  }
}
