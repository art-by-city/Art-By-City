import { injectable } from 'inversify'
import { Collection } from 'firebase-firestorm'

import Artwork from './artwork'
import ArtworkRepositoryInterface from './repository.interface'

@injectable()
export default class ArtworkRepository implements ArtworkRepositoryInterface {
  create(artwork: Artwork): Promise<Artwork | null> {
    try {
      return Collection(Artwork).create(artwork)
    } catch (error) {
      throw new Error(`Error creating new artwork: ${error.message}`)
    }
  }

  get(id: string): Promise<Artwork | null> {
    try {
      return Collection(Artwork).get(id)
    } catch (error) {
      throw new Error(`Error getting artwork by id: ${error.message}`)
    }
  }

  async list(): Promise<Artwork[]> {
    try {
      const { docs } = await Collection(Artwork)
        .query()
        .get()

      return docs
    } catch (error) {
      throw new Error(`Error listing artwork: ${error.message}`)
    }
  }

  update(artwork: Artwork): Promise<Artwork | null> {
    try {
      return Collection(Artwork).update(artwork)
    } catch (error) {
      throw new Error(`Error updating artwork: ${error.message}`)
    }
  }

  delete(id: string): Promise<void> {
    try {
      return Collection(Artwork).remove(id)
    } catch (error) {
      throw new Error(`Error deleting artwork: ${error.message}`)
    }
  }
}
