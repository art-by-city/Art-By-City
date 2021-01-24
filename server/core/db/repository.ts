import { getRepository, BaseFirestoreRepository, IEntity, Instantiable } from 'fireorm'
import { injectable } from 'inversify'

interface TrackableEntity extends IEntity {
  created: Date
  updated: Date
}

@injectable()
export default class BaseRepositoryImpl<T extends TrackableEntity> {
  private x: Instantiable<T>
  protected repository: BaseFirestoreRepository<T>

  constructor(x: Instantiable<T>) {
    this.x = x
    this.repository = getRepository(x)
  }

  create(thing: T): Promise<T> {
    try {
      thing.created = new Date()
      thing.updated = thing.created
      return this.repository.create(thing)
    } catch (error) {
      throw new Error(`Error creating new ${this.x.name}: ${error.message}`)
    }
  }

  get(id: string): Promise<T | null> {
    try {
      return this.repository.findById(id)
    } catch (error) {
      throw new Error(`Error getting ${this.x.name} by id: ${error.message}`)
    }
  }

  list(): Promise<T[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error listing ${this.x.name}: ${error.message}`)
    }
  }

  findOne(): Promise<T | null> {
    try {
      return this.repository.findOne()
    } catch (error) {
      throw new Error(`Error finding one ${this.x.name}: ${error.message}`)
    }
  }

  update(thing: T, modifyUpdated: boolean = true): Promise<T> {
    try {
      if (modifyUpdated) {
        thing.updated = new Date()
      }

      return this.repository.update(thing)
    } catch (error) {
      throw new Error(`Error updating ${this.x.name}: ${error.message}`)
    }
  }

  delete(id: string): Promise<void> {
    try {
      return this.repository.delete(id)
    } catch (error) {
      throw new Error(`Error deleting ${this.x.name}: ${error.message}`)
    }
  }
}