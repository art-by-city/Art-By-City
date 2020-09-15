import { injectable, inject } from 'inversify'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import BaseRepositoryImpl from '../db/repository'
import { File, FileRepository, FileFilterOptions } from './'

@injectable()
export default class FileRepositoryImpl
  extends BaseRepositoryImpl<File>
  implements FileRepository {

  constructor(
    @inject(Symbol.for('DatabaseAdapter'))
    databaseAdapter: DatabaseAdapter
  ) {
    super(File)
    this.client = databaseAdapter.getClient()
  }

  getDocumentReference(id: string): DocumentReference<File> {
    return <DocumentReference<File>>this.client.doc(`Files/${id}`)
  }

  find(_filter?: FileFilterOptions): Promise<File[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error finding files: ${error.message}`)
    }
  }

  findOne(filter?: FileFilterOptions): Promise<File | null> {
    try {
      let query = this.repository.orderByAscending('id')

      if (filter && filter.name) {
        query = query.whereEqualTo('name', filter.name)
      }

      if (filter && filter.owner) {
        query = query.whereEqualTo('owner', filter.owner)
      }

      if (filter && filter.assetType) {
        query = query.whereEqualTo('assetType', filter.assetType)
      }

      return query.findOne()
    } catch (error) {
      throw new Error(`Error finding file: ${error.message}`)
    }
  }

  private client: Firestore
}
