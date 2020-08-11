import _, { slice } from 'lodash'
import { injectable, inject } from 'inversify'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import { Artwork, ArtworkRepository, ArtworkFilterOptions } from './'
import BaseRepositoryImpl from '../db/repository'

@injectable()
export default class ArtworkRepositoryImpl
  extends BaseRepositoryImpl<Artwork>
  implements ArtworkRepository {
  private collectionName = 'Artworks'
  private client: Firestore

  constructor(
    @inject(Symbol.for('DatabaseAdapter')) databaseAdapter: DatabaseAdapter
  ) {
    super(Artwork)
    this.client = databaseAdapter.getClient()
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

      if (!filter.includeUnpublished) {
        query = query.where('published', '==', true)
      }

      if (!filter.includeUnapproved) {
        query = query.where('approved', '==', true)
      }

      if (filter.hashtags) {
        query = query.where('hashtags', 'array-contains-any', filter.hashtags.slice(0, 10))
      }

      if (filter.lastFetchedArtworkId) {
        query = query.startAfter(filter.lastFetchedArtworkId)
      }

      const found = await query.get()

      let matches: Artwork[] = found.docs.map((doc) => {
        return <Artwork>doc.data()
      })

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

  getDocumentReference(id: string): DocumentReference<Artwork> {
    return <DocumentReference<Artwork>>this.client.doc(`Artworks/${id}`)
  }
}
