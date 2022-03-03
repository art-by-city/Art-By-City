import { Signer } from 'arbundles/src/signing'

import { APP_INFO } from '~/schemes/arweave-wallet'
import ArweaveWalletSigner from './arweaveWalletSigner'

export default class SignerFactory {
  static async create(): Promise<Signer> {
    await window.arweaveWallet.connect([
      'ACCESS_PUBLIC_KEY',
      'SIGNATURE',
      'SIGN_TRANSACTION'
    ], APP_INFO)
    const publicKey = await window.arweaveWallet.getActivePublicKey()
    const publicKeyBuffer = Buffer.from(publicKey, 'base64')

    return new ArweaveWalletSigner(publicKeyBuffer)
  }
}