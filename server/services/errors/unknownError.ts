import ApiServiceError from './apiServiceError.interface'

export default class UnknownError implements ApiServiceError {
  statusCode = 500
  name = this.constructor.name
  message = 'An unknown error has occurred'
}
