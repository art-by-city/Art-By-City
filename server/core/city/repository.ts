import { injectable, inject } from 'inversify'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import BaseRepositoryImpl from '../db/repository'
import { City, CityRepository, CityFilterOptions } from './'

@injectable()
export default class CityRepositoryImpl
  extends BaseRepositoryImpl<City>
  implements CityRepository {
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter'))
    databaseAdapter: DatabaseAdapter
  ) {
    super(City)
    this.client = databaseAdapter.getClient()
  }

  getDocumentReference(id: string): DocumentReference<City> {
    return <DocumentReference<City>>this.client.doc(`Cities/${id}`)
  }

  list(): Promise<City[]> {
    try {
      return this.repository.whereEqualTo('visible', true).orderByAscending('name').find()
    } catch (error) {
      throw new Error(`Error listing cities: ${error.message}`)
    }
  }

  find(_filter?: CityFilterOptions): Promise<City[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error finding cities: ${error.message}`)
    }
  }
}
