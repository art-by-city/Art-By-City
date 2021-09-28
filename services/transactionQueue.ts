import { Context } from '@nuxt/types'
import { queue, QueueObject } from 'async'

import { accessorType } from '~/store'
import { UserTransaction, UserTransactionStatus, isProcessing } from '~/types'
import { ADD_TRANSACTION } from '~/store/transactions/mutations'
import { ArweaveService } from './base'

export default class TransactionQueueService extends ArweaveService {
  private queue!: QueueObject<UserTransaction>
  private $accessor!: typeof accessorType
  private waitForConfirmations!: number
  private sleep: number = 2000
  private timestamp = Date.now()

  constructor(context: Context) {
    super(context)

    this.$accessor = context.app.$accessor
    this.waitForConfirmations =
      context.$config.arweave.waitForConfirmations || 12

    this.buildQueue()

    context.store.subscribe((mutation) => {
      switch (mutation.type) {
        case `transactions/${ADD_TRANSACTION}`:
          this.push(mutation.payload)
          break
        case 'RESTORE_MUTATION':
          if (
            mutation.payload.transactions &&
            mutation.payload.transactions.transactions
          ) {
            const transactions =
              mutation.payload.transactions.transactions as UserTransaction[]
            this.push(transactions.filter((tx) => isProcessing(tx.status)))
          }
          break
        case 'auth/SET':
          if (mutation.payload.key === 'loggedIn' && !mutation.payload.value) {
            this.rebuildQueue()
          }
        default:
          break
      }
    })
  }

  private buildQueue() {
    this.queue = queue(this.processUserTransaction.bind(this))
    this.queue.error((error) => {
      console.error('TransactionQueueError', error)
    })
  }

  private rebuildQueue() {
    this.queue.pause()
    this.queue.kill()
    this.buildQueue()
  }

  private async push(tx: UserTransaction | UserTransaction[], delay?: number) {
    if (delay) {
      setTimeout(() => { this.queue.push(tx) }, delay, this)
    } else {
      this.queue.push(tx)
    }
  }

  private async processUserTransaction(
    tx: UserTransaction,
    done: Function
  ) {
    switch (tx.status) {
      case 'PENDING_SUBMISSION':
        this.submitUserTransaction(tx, done)
        break
      case 'PENDING_CONFIRMATION':
      case 'CONFIRMING':
        this.checkUserTransactionStatus(tx, done)
        break
      case 'CONFIRMED':
        done()
        break
      case 'DROPPED':
        done(new Error(
          `Transaction seems to have been dropped: ${tx.transaction.id}`
        ))
    }
  }

  private async checkUserTransactionStatus(
    tx: UserTransaction,
    done: Function
  ) {
    const res = await this.$arweave.transactions.getStatus(tx.transaction.id)

    let error
    if (res.status === 200 && res.confirmed) {
      let status: UserTransactionStatus = 'CONFIRMING'
      if (res.confirmed.number_of_confirmations >= this.waitForConfirmations) {
        status = 'CONFIRMED'
      }

      this.$accessor.transactions.updateStatus({
        id: tx.transaction.id,
        status,
        confirmations: res.confirmed.number_of_confirmations,
        type: tx.type
      })
      if (status === 'CONFIRMING') {
        this.push(tx, this.sleep)
      }
    } else if (res.status === 202) {
      this.$accessor.transactions.updateStatus({
        id: tx.transaction.id,
        status: 'PENDING_CONFIRMATION',
        type: tx.type
      })
      this.push(tx, this.sleep)
    } else {
      error = new Error(
        `Failed to get tx status (${res.status}) for tx id ${tx.transaction.id}`
      )
    }

    done(error)
  }

  private async submitUserTransaction(
    tx: UserTransaction,
    done: Function
  ) {
    const res = await this.$arweave.transactions.post(tx.transaction)

    let error
    if ([200, 202].includes(res.status)) {
      this.$accessor.transactions.updateStatus({
        id: tx.transaction.id,
        status: 'PENDING_CONFIRMATION',
        type: tx.type
      })

      this.push(tx, this.sleep)
    } else {
      error = new Error(
        `Failed to submit tx (${res.status}): ${res.statusText}`
      )
    }

    done(error)
  }
}
