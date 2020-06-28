import _ from 'lodash'
import { injectable, inject } from 'inversify'
import { getRepository } from 'fireorm'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import { User } from '../user'
import { Artwork, ArtworkRepository, ArtworkFilterOptions } from './'

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

  list(limit: number = 9): Promise<Artwork[]> {
    try {
      return this.repository.limit(limit).find()
    } catch (error) {
      throw new Error(`Error listing artwork: ${error.message}`)
    }
  }

  async find(filter?: ArtworkFilterOptions): Promise<Artwork[]> {
    try {
      if (!filter) {
        return this.list()
      }

      let query = this.repository.orderByAscending('id')

      if (filter.owner) {
        query = query.whereEqualTo('owner', filter.owner)
      }

      if (filter.region) {
        query = query.whereEqualTo('region', filter.region)
      }

      if (filter.type) {
        query = query.whereEqualTo('type', filter.type)
      }

      if (filter.hashtags) {
        query = query.whereArrayContains('hashtags', filter.hashtags[0])
      }

      const found = await query.find()

      let matches: Artwork[] = [...found]
      if (filter.hashtags && filter.hashtags.length > 0) {
        filter.hashtags.forEach((hashtag) => {
          matches = matches.filter((doc) => {
            return doc.hashtags.includes(hashtag)
          })
        })
      }

      // Shuffle
      matches = filter.shuffle ? _.shuffle(matches) : matches

      // Limit
      if (filter.limit) {
        matches = matches.slice(0, filter.limit)
      }

      return matches
    } catch (error) {
      throw new Error(`Error listing artwork: ${error.message}`)
    }
  }

  update(artwork: Artwork): Promise<Artwork> {
    try {
      if ((<User>artwork.owner).id) {
        artwork.owner = (<User>artwork.owner).id
      }

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
