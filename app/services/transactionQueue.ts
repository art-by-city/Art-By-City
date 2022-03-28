import { Context } from '@nuxt/types'
import { MutationPayload } from 'vuex'
import { queue, QueueObject } from 'async'

import { accessorType } from '~/store'
import {
  UserTransaction,
  UserTransactionStatus,
  isProcessing,
  SetUserTransactionStatusPayload
} from '~/app/ui'

import {
  ADD_TRANSACTION,
  SET_TRANSACTION_STATUS
} from '~/store/transactions/mutations'
import { ArweaveService } from './base'
import Transaction from 'arweave/web/lib/transaction'
import _ from 'lodash'

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

    const txStatus = {
      id: utx.id,
      status,
      confirmations,
      type: utx.type
    }

    this.$accessor.transactions.updateStatus(txStatus)

    if (['CONFIRMING', 'CONFIRMED', 'DROPPED'].includes(status)) {
      if (utx.type === 'like') {
        window.$nuxt.$emit(`${utx.type}-${status}`, utx.entityId)
      } else {
        window.$nuxt.$emit(`${utx.type}-${status}`, txStatus)
      }
    }

    done()
  }

  async submitUserTransaction(
    tx: Transaction,
    utx: UserTransaction,
    done: Function,
    chunk: boolean = false,
    infoCb?: Function
  ) {
    let error, status: number, statusText: string

    const balance = await this.$arweave.wallets.getBalance(
      this.context.$auth.user.address
    )

    const price = await this.$arweave.transactions.getPrice(
      Number.parseInt(tx.data_size)
    )

    const diff = Number.parseInt(this.$arweave.ar.sub(balance, price))

    if (diff < 0) {
      error = new Error('Insufficient funds')
    }

    if (!error) {
      if (!chunk) {
        const res = await this.$arweave.transactions.post(tx)

        status = res.status
        statusText = res.statusText
      } else {
        const uploader = await this.$arweave.transactions.getUploader(tx)

        while (!uploader.isComplete) {
          await uploader.uploadChunk()
          if (infoCb) {
            infoCb(uploader.pctComplete)
          }
        }

        status = uploader.lastResponseStatus
        statusText = uploader.lastResponseError
      }

      if ([200, 202].includes(status)) {
        this.$accessor.transactions.queueTransaction(utx)
      } else if ([410].includes(status)) {
        error = new Error('Insufficient funds')
      } else {
        error = new Error(
          `Failed to submit tx (${status}): ${statusText}`
        )
      }
    }

    done(error)
  }
}
