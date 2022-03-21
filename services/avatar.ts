import Transaction from 'arweave/node/lib/transaction'

import { Avatar } from '~/types'
import { TransactionService } from './'

export default class AvatarService extends TransactionService {
  cache: { avatars: { [address: string]: Avatar } } = { avatars: {} }

  async createAvatarTransaction(
    data: ArrayBuffer,
    imageType: string
  ): Promise<Transaction> {
    const tx = await this.transactionFactory.buildEntityTransaction(
      'avatar',
      data,
      [{ tag: 'Content-Type', value: imageType }]
    )

    return tx
  }

  async fetchAvatar(
    address: string,
    force: boolean = false
  ): Promise<Avatar | null> {
    if (force || !this.cache.avatars[address]) {
      const result = await this.transactionFactory.searchTransactions(
        'avatar',
        address,
        {
          sort: 'HEIGHT_DESC',
          tags: []
        }
      )

      let avatar: Avatar | null = null
      if (result.transactions[0]) {
        const txId = result.transactions[0].id
        const res = await this.$arweave.api.get(txId)
        if (res.data.src) {
          // v1 format

          // NB: resolve mime type from data url src quickly
          // maybe this is faster than .split() ?
          let type = res.data.src.substring(5, 14)
          // data:image/jpe
          if (type[6] === 'j') {
            type += 'g'
          }

          avatar = {
            id: txId,
            src: res.data.src,
            type: type,
            version: 1
          }
        } else {
          // v2 format
          const config = this.config.api
          const src = `${config.protocol}://${config.host}:${config.port}/${txId}`
          const tx = result.transactions[0]

          const type = tx.tags.find(tag => tag.name === 'Content-Type')?.value
            || 'image/png'

          avatar = {
            id: txId,
            src,
            type,
            version: 2
          }
        }
      }

      if (avatar) {
        this.cache.avatars[address] = avatar
      }
    }

    return this.cache.avatars[address] || null
  }
}
