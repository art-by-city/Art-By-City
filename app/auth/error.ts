export class ArweaveWalletNotInstalledError extends Error {
  constructor() {
    super('Arweave Wallet extension not installed')
    this.name = 'ArweaveWalletNotInstalledError'
  }
}
