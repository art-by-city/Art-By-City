import { DocumentReference, Firestore } from '@google-cloud/firestore'
import { injectable, inject } from 'inversify'

import { Wallet, WalletsRepository } from '.'
import DatabaseAdapter from '../db/adapter.interface'
import BaseRepositoryImpl from '../db/repository'

@injectable()
export default class WalletsRepositoryImpl
  extends BaseRepositoryImpl<Wallet>
  implements WalletsRepository {
  private collectionName = 'Wallets'
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter'))
    databaseAdapter: DatabaseAdapter
  ) {
    super(Wallet)
    this.client = databaseAdapter.getClient()
  }
  getWalletForUser(userId: string): Promise<Wallet | null> {
    throw new Error('Method not implemented.')
  }

  getDocumentReference(id: string):
    FirebaseFirestore.DocumentReference<Wallet> {
    return <DocumentReference<Wallet>>this.client.doc(`Wallets/${id}`)
  }
  find(filter?: {}): Promise<Wallet[]> {
    throw new Error('Method not implemented.')
  }

}
