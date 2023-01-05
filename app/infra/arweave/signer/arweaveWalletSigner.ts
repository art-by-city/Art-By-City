import Arweave from 'arweave'
import { Signer } from 'arbundles/src/signing'
import { SignatureConfig, SIG_CONFIG } from 'arbundles/src/constants'

export default class ArweaveWalletSigner implements Signer {
  signatureType: number = SignatureConfig.ARWEAVE
  ownerLength: number = SIG_CONFIG[SignatureConfig.ARWEAVE].pubLength
  signatureLength: number = SIG_CONFIG[SignatureConfig.ARWEAVE].sigLength
  publicKey: Buffer

  constructor(publicKey: Buffer) {
    this.publicKey = publicKey
  }

  async sign(message: Uint8Array): Promise<Uint8Array> {
    const signature = await window.arweaveWallet.signature(message, {
      name: "RSA-PSS",
      saltLength: 32,
    })

    return Buffer.from(signature)
  }

  static async verify(
    pk: string,
    message: Uint8Array,
    signature: Uint8Array,
  ): Promise<boolean> {
    return await Arweave.crypto.verify(pk, message, signature)
  }
}
