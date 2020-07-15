import { injectable, inject } from 'inversify'
import { Firestore, DocumentReference } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import { HashtagRepository, Hashtag, HashtagFilterOptions } from '.'
import BaseRepositoryImpl from '../common/repository'

@injectable()
export default class HashtagRepositoryImpl
  extends BaseRepositoryImpl<Hashtag>
  implements HashtagRepository {
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter'))
    databaseAdapter: DatabaseAdapter
  ) {
    super(Hashtag)

    this.client = databaseAdapter.getClient()
  }

  getDocumentReference(id: string): DocumentReference<Hashtag> {
    return <DocumentReference<Hashtag>>(
      this.client.doc(`Hashtags/${id}`)
    )
  }

  find(_filter?: HashtagFilterOptions): Promise<Hashtag[]> {
    return this.repository.orderByAscending('hashtag').find()
  }

  findByHashtag(hashtag: string): Promise<Hashtag | null> {
    return this.repository.whereEqualTo('hashtag', hashtag).findOne()
  }
}
