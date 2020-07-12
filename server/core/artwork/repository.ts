import _ from 'lodash'
import { injectable, inject } from 'inversify'
import { getRepository } from 'fireorm'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import { User } from '../user'
import { Artwork, ArtworkRepository, ArtworkFilterOptions } from './'

@injectable()
export default class ArtworkRepositoryImpl implements ArtworkRepository {
  private collectionName = 'Artworks'
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

      let query = this.client
        .collection(this.collectionName)
        .orderBy('id', 'asc')

      if (filter.owner) {
        query = query.where('owner', '==', filter.owner)
      }

      if (filter.city) {
        query = query.where('city', '==', filter.city)
      }

      if (filter.type) {
        query = query.where('type', '==', filter.type)
      }

      if (filter.hashtags) {
        query = query.where('hashtags', 'array-contains', filter.hashtags[0])
      }

      if (filter.lastFetchedArtworkId) {
        query = query.startAfter(filter.lastFetchedArtworkId)
      }

      const found = await query.get()

      let matches: Artwork[] = found.docs.map((doc) => {
        return <Artwork>doc.data()
      })
      if (filter.hashtags && filter.hashtags.length > 0) {
        filter.hashtags.forEach((hashtag) => {
          matches = matches.filter((doc) => {
            return doc.hashtags.includes(hashtag)
          })
        })
      }

      // Limit
      if (filter.limit) {
        matches = matches.slice(0, filter.limit)
      }

      // Shuffle
      matches = filter.shuffle ? _.shuffle(matches) : matches

      return matches
    } catch (error) {
      throw new Error(`Error finding artwork: ${error.message}`)
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
