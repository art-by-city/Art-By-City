export class ContractError extends Error {
  constructor(message: any) {
    super(message);
    this.name = 'ContractError'
  }
}
