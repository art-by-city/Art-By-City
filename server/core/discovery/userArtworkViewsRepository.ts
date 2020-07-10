import { injectable, inject } from 'inversify'
import { getRepository } from 'fireorm'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import {
  UserArtworkViewsRepository,
  UserArtworkViews,
  DiscoveryFilterOptions
} from './'

@injectable()
export default class UserArtworkViewsRepositoryImpl
  implements UserArtworkViewsRepository {
  private repository = getRepository(UserArtworkViews)
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter')) databaseAdapter: DatabaseAdapter
  ) {
    this.client = databaseAdapter.getClient()
  }

  create(userArtworkViews: UserArtworkViews): Promise<UserArtworkViews> {
    try {
      return this.repository.create(userArtworkViews)
    } catch (error) {
      throw new Error(`Error createing new UserArtworkViews: ${error.message}`)
    }
  }

  get(id: string): Promise<UserArtworkViews | null> {
    try {
      return this.repository.findById(id)
    } catch (error) {
      throw new Error(`Error getting UserArtworkViews by id: ${error.message}`)
    }
  }

  list(): Promise<UserArtworkViews[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error listing UserArtworkViews: ${error.message}`)
    }
  }

  find(_filter?: DiscoveryFilterOptions): Promise<UserArtworkViews[]> {
    try {
      return this.list()
    } catch (error) {
      throw new Error(`Error listing UserArtworkViews: ${error.message}`)
    }
  }

  findOne(filter?: DiscoveryFilterOptions): Promise<UserArtworkViews | null> {
    try {
      if (filter && filter.userId) {
        return this.repository.whereEqualTo('userId', filter.userId).findOne()
      }

      return this.repository.findOne()
    } catch (error) {
      throw new Error(`Error finding one UserArtworkViews: ${error.message}`)
    }
  }

  update(userArtworkViews: UserArtworkViews): Promise<UserArtworkViews> {
    try {
      return this.repository.update(userArtworkViews)
    } catch (error) {
      throw new Error(`Error updating UserArtworkViews: ${error.message}`)
    }
  }

  delete(id: string): Promise<void> {
    try {
      return this.repository.delete(id)
    } catch (error) {
      throw new Error(`Error deleting UserArtworkViews: ${error.message}`)
    }
  }

  getDocumentReference(id: string): DocumentReference<UserArtworkViews> {
    return <DocumentReference<UserArtworkViews>>(
      this.client.doc(`UserArtworkViews/${id}`)
    )
  }
}
