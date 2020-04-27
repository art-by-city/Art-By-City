import ApiServiceError from '../../interfaces/services/errors/apiServiceError.interface'

export default class UserNotFoundError implements ApiServiceError {
  statusCode = 404
  name = this.constructor.name
  message = 'User not found'
}
