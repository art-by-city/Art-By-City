import { injectable, inject } from 'inversify'
import { Firestore, DocumentReference } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import BaseRepositoryImpl from '../db/repository'
import { Config, ConfigRepository } from './'

@injectable()
export default class ConfigRepositoryImpl
  extends BaseRepositoryImpl<Config>
  implements ConfigRepository {
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter'))
    databaseAdapter: DatabaseAdapter
  ) {
    super(Config)
    this.client = databaseAdapter.getClient()
  }

  getDocumentReference(id: string): DocumentReference<Config> {
    return <DocumentReference<Config>>(
      this.client.doc(`Config/${id}`)
    )
  }

  find(): Promise<Config[]> {
    return this.repository.find()
  }

  get(): Promise<Config | null>  {
    return this.repository.findOne()
  }
}
