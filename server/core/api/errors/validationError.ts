import ApiServiceError from './apiServiceError.interface'

export default class ValidationError implements ApiServiceError {
  statusCode = 400
  name = this.constructor.name
  message = 'Validation Error'
  messages?: string[]

  constructor(messages?: string[]) {
    if (messages) {
      this.messages = messages
      this.message = messages.join(',\n')
    }
  }
}
