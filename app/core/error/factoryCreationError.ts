export default class FactoryCreationError extends Error {
  constructor(message?: string) {
    super(
      message
        ? `${message}`
        : ''
    )
    this.name = 'FactoryCreationError'
  }
}
