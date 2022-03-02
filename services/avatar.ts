import Transaction from 'arweave/node/lib/transaction'

import { Avatar } from '~/types'
import { TransactionService } from './'

export default class AvatarService extends TransactionService {
  async createAvatarTransaction(data: ArrayBuffer, imageType: string):
    Promise<Transaction> {
    const tx = await this.transactionFactory.buildEntityTransaction(
      'avatar',
      data,
      [{ tag: 'Content-Type', value: imageType }]
    )

    return tx
  }

  async fetchAvatar(address: string): Promise<Avatar | null> {
    const result = await this.transactionFactory.searchTransactions(
      'avatar',
      address,
      {
        sort: 'HEIGHT_DESC',
        tags: []
      }
    )

    if (result.transactions[0]) {
      const txId = result.transactions[0].id
      const res = await this.$arweave.api.get(txId)
      if (res.data.src) {
        // v1 format

        // NB: resolve mime type from data url src quickly
        // maybe this is faster than .split() ?
        let imageType = res.data.src.substring(5, 14)
        // data:image/jpe
        if (imageType[6] === 'j') {
          imageType += 'g'
        }

        return {
          id: txId,
          src: res.data.src,
          type: imageType
        }
      } else {
        // v2 format
        const config = this.config.api
        const src = `${config.protocol}://${config.host}:${config.port}/${txId}`
        const tx: any = result.transactions[0]

        const tags: { name: string, value: string }[] = tx._tags
        const type = tags.find(tag => tag.name === 'Content-Type')?.value
          || 'image/png'

        return {
          id: txId,
          src,
          type
        }
      }
    }

    return null
  }
}
