import ApiServiceError from './apiServiceError.interface'

export default class UnauthorizedError implements ApiServiceError {
  statusCode = 401
  name = this.constructor.name
  message = 'Unauthorized'
}
