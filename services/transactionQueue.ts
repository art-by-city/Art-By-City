import { Context } from '@nuxt/types'
import { MutationPayload } from 'vuex'
import { queue, QueueObject } from 'async'

import { accessorType } from '~/store'
import {
  UserTransaction,
  UserTransactionStatus,
  isProcessing,
  SetUserTransactionStatusPayload
} from '~/types'
import {
  ADD_TRANSACTION,
  SET_TRANSACTION_STATUS
} from '~/store/transactions/mutations'
import { ArweaveService } from './base'
import Transaction from 'arweave/web/lib/transaction'

export default class TransactionQueueService extends ArweaveService {
  private queue!: QueueObject<UserTransaction>
  private $accessor!: typeof accessorType
  private waitForConfirmations!: number
  private sleep: number = 5000
  private waitToFlagAsDroppedConfirms: number = 50
  private waitToFlagAsDroppedTime: number = 1000 * 60 * 60 * 1 // NB: 1 hour

  constructor(context: Context) {
    super(context)

    this.$accessor = context.app.$accessor
    this.waitForConfirmations =
      context.$config.arweave.waitForConfirmations || 12

    this.buildQueue()

    context.store.subscribe(this.subscription.bind(this))
  }

  private subscription(mutation: MutationPayload) {
    switch (mutation.type) {
      case `transactions/${ADD_TRANSACTION}`:
        this.onAddTransactionMutation(mutation)
        break
      case `transactions/${SET_TRANSACTION_STATUS}`:
        this.onSetTransactionStatusMutation(mutation)
        break
      case 'RESTORE_MUTATION':
        this.onRestoreMutation(mutation)
        break
      case 'auth/SET':
        this.onLoggedOutMutation(mutation)
      default:
        break
    }
  }

  private onSetTransactionStatusMutation(mutation: MutationPayload) {
    const payload = mutation.payload as SetUserTransactionStatusPayload

    if (
      [
        'PENDING_SUBMISSION',
        'PENDING_CONFIRMATION',
        'CONFIRMING'
      ].includes(payload.status)) {
      const utx = this.$accessor.transactions.getById(payload.id)

      if (utx) {
        this.push(utx, this.sleep)
      }
    }
  }

  private onAddTransactionMutation(mutation: MutationPayload) {
    this.push(mutation.payload)
  }

  private onRestoreMutation(mutation: MutationPayload) {
    if (
      mutation.payload.transactions &&
      mutation.payload.transactions.transactions
    ) {
      const userTransactions =
        mutation.payload.transactions.transactions as UserTransaction[]
      const processingTransactions =
        userTransactions.filter((utx) => isProcessing(utx.status))
      this.push(processingTransactions)
    }
  }

  private onLoggedOutMutation(mutation: MutationPayload) {
    if (mutation.payload.key === 'loggedIn' && !mutation.payload.value) {
      this.rebuildQueue()
    }
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

  private async push(utx: UserTransaction | UserTransaction[], delay?: number) {
    if (delay) {
      setTimeout(() => { this.queue.push(utx) }, delay, this)
    } else {
      this.queue.push(utx)
    }
  }

  private async processUserTransaction(
    utx: UserTransaction,
    done: Function
  ) {
    switch (utx.status) {
      case 'PENDING_SUBMISSION':
        // this.submitUserTransaction(tx, done)
        break
      case 'PENDING_CONFIRMATION':
      case 'CONFIRMING':
        this.checkUserTransactionStatus(utx, done)
        break
      case 'CONFIRMED':
      case 'DROPPED':
      default:
        done()
        break
    }
  }

  private async checkUserTransactionStatus(
    utx: UserTransaction,
    done: Function
  ) {
    const res = await this.$arweave.transactions.getStatus(utx.id)
    const lastSubmission = utx.lastSubmission || utx.created

    let status: UserTransactionStatus ='CONFIRMING'
    let confirmations: number | undefined = undefined
    if (res.status === 200 && res.confirmed) {
      status = 'CONFIRMING'
      if (res.confirmed.number_of_confirmations >= this.waitForConfirmations) {
        status = 'CONFIRMED'
      }
      confirmations = res.confirmed.number_of_confirmations
    } else if (res.status === 202) {
      status = 'PENDING_CONFIRMATION'
    } else if (
      res.status === 404
      && ['PENDING_CONFIRMATION', 'CONFIRMING'].includes(utx.status)
    ) {
      let waitedLongEnough: boolean = false
      if (utx.last_tx) {
        try {
          // NB: check tx anchor for >50 confirms
          const anchor = await this.$arweave.transactions.getStatus(
            utx.last_tx
          )

          if (
            anchor.status === 200
            && anchor.confirmed
            && anchor.confirmed.number_of_confirmations
              > this.waitToFlagAsDroppedConfirms
          ) {
            waitedLongEnough = true
          }
        } catch (error) {
          console.error('bad tx anchor')
        }
      }

      // NB: if this is the wallet's first tx, they might not have a tx anchor
      //     also, the above code might throw given a bad tx anchor
      if (!waitedLongEnough) {
        const now = new Date().getTime()
        waitedLongEnough = (now - lastSubmission) > this.waitToFlagAsDroppedTime
      }

      if (waitedLongEnough) {
        status = 'DROPPED'
      }
    }

    this.$accessor.transactions.updateStatus({
      id: utx.id,
      status,
      confirmations,
      type: utx.type
    })

    done()
  }

  async submitUserTransaction(tx: Transaction, utx: UserTransaction, done: Function) {
    const res = await this.$arweave.transactions.post(tx)

    let error
    if ([200, 202].includes(res.status)) {
      // call store queue transaction
      // PENDING_CONFIRMATION
      this.$accessor.transactions.queueTransaction(utx)
      // this.$accessor.transactions.updateStatus({
      //   id: tx.transaction.id,
      //   status: 'PENDING_CONFIRMATION',
      //   type: tx.type,
      //   lastSubmission: new Date().getTime()
      // })
    } else if ([410].includes(res.status)) {
      error = new Error('Insufficient funds')
    } else {
      error = new Error(
        `Failed to submit tx (${res.status}): ${res.statusText}`
      )
    }

    done(error)
  }
}
