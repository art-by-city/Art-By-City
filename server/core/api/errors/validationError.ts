import ApiServiceError from './apiServiceError.interface'

export default class ValidationError implements ApiServiceError {
  statusCode = 400
  name = this.constructor.name
  message = 'Validation Error'

  constructor(messages?: string[]) {
    if (messages) {
      this.message = messages.join('\n')
    }
  }
}
