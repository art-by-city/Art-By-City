import ApiServiceError from '../api/errors/apiServiceError.interface'

export default class EmailSendError implements ApiServiceError {
  statusCode = 500
  name = this.constructor.name
  message = 'Error while sending email'

  constructor(message?: string) {
    if (message) {
      this.message = `${this.message}: ${message}`
    }
  }
}
