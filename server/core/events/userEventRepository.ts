import { injectable, inject } from 'inversify'
import { Firestore, DocumentReference } from '@google-cloud/firestore'

import BaseRepositoryImpl from '../common/repository'
import DatabaseAdapter from '../db/adapter.interface'
import { UserEvent, UserEventRepository, UserEventFilterOptions } from './'

@injectable()
export default class UserEventRepositoryImpl
  extends BaseRepositoryImpl<UserEvent>
  implements UserEventRepository {
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter'))
    databaseAdapter: DatabaseAdapter
  ) {
    super(UserEvent)

    this.client = databaseAdapter.getClient()
  }

  getDocumentReference(id: string): FirebaseFirestore.DocumentReference<UserEvent> {
    return <DocumentReference<UserEvent>>(
      this.client.doc(`UserEvents/${id}`)
    )
  }

  find(filter?: UserEventFilterOptions): Promise<UserEvent[]> {
    return this.repository.orderByDescending('timestamp').find()
  }

}