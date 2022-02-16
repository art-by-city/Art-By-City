export default class FactoryCreationError extends Error {
  constructor(message?: string) {
    super(
      'Error creating Domain Entity' + message
        ? `: ${message}`
        : ''
    )
    this.name = 'FactoryCreationError'
  }
}
