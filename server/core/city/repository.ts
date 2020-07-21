import { injectable, inject } from 'inversify'
import { getRepository } from 'fireorm'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import { City, CityRepository, CityFilterOptions } from './'

@injectable()
export default class CityRepositoryImpl implements CityRepository {
  private repository = getRepository(City)
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter')) databaseAdapter: DatabaseAdapter
  ) {
    this.client = databaseAdapter.getClient()
  }

  create(city: City): Promise<City> {
    try {
      return this.repository.create(city)
    } catch (error) {
      throw new Error(`Error creating new city: ${error.message}`)
    }
  }

  get(id: string): Promise<City | null> {
    try {
      return this.repository.findById(id)
    } catch (error) {
      throw new Error(`Error getting city by id: ${error.message}`)
    }
  }

  list(): Promise<City[]> {
    try {
      return this.repository.orderByAscending('name').find()
    } catch (error) {
      throw new Error(`Error listing cities: ${error.message}`)
    }
  }

  update(city: City): Promise<City> {
    try {
      return this.repository.update(city)
    } catch (error) {
      throw new Error(`Error updating city: ${error.message}`)
    }
  }

  delete(id: string): Promise<void> {
    try {
      return this.repository.delete(id)
    } catch (error) {
      throw new Error(`Error deleting city: ${error.message}`)
    }
  }

  getDocumentReference(id: string): DocumentReference<City> {
    return <DocumentReference<City>>this.client.doc(`Cities/${id}`)
  }

  find(_filter?: CityFilterOptions): Promise<City[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error finding cities: ${error.message}`)
    }
  }
}
