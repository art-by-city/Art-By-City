import { injectable, inject } from 'inversify'
import { getRepository } from 'fireorm'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import { User } from '../user'
import { Artwork, ArtworkRepository } from './'

@injectable()
export default class ArtworkRepositoryImpl implements ArtworkRepository {
  private repository = getRepository(Artwork)
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter')) databaseAdapter: DatabaseAdapter
  ) {
    this.client = databaseAdapter.getClient()
  }

  create(artwork: Artwork): Promise<Artwork> {
    try {
      return this.repository.create(artwork)
    } catch (error) {
      throw new Error(`Error creating new artwork: ${error.message}`)
    }
  }

  get(id: string): Promise<Artwork | null> {
    try {
      return this.repository.findById(id)
    } catch (error) {
      throw new Error(`Error getting artwork by id: ${error.message}`)
    }
  }

  list(): Promise<Artwork[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error listing artwork: ${error.message}`)
    }
  }

  async find(filter?: Artwork): Promise<Artwork[]> {
    try {
      if (!filter) {
        return this.list()
      }

      const found = await this.repository
        .whereEqualTo('owner', <DocumentReference<User>>filter.owner)
        .find()

      return found
    } catch (error) {
      throw new Error(`Error listing artwork: ${error.message}`)
    }
  }

  update(artwork: Artwork): Promise<Artwork> {
    try {
      return this.repository.update(artwork)
    } catch (error) {
      throw new Error(`Error updating artwork: ${error.message}`)
    }
  }

  delete(id: string): Promise<void> {
    try {
      return this.repository.delete(id)
    } catch (error) {
      throw new Error(`Error deleting artwork: ${error.message}`)
    }
  }

  getDocumentReference(id: string): DocumentReference<Artwork> {
    return <DocumentReference<Artwork>>this.client.doc(`Artworks/${id}`)
  }
}
