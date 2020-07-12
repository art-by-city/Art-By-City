import { getRepository, BaseFirestoreRepository, IEntity, Instantiable } from 'fireorm'
import { injectable } from 'inversify'

type Abstract<T> = Function & {prototype: T};
type Constructor<T> = new (...args: any[]) => T;
type Class<T> = Abstract<T> | Constructor<T>;

@injectable()
export default class BaseRepositoryImpl<T extends IEntity> {
  private x: Instantiable<T>
  protected repository: BaseFirestoreRepository<T>

  constructor(x: Instantiable<T>) {
    this.x = x
    this.repository = getRepository(x)
  }

  create(thing: T): Promise<T> {
    try {
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

  update(thing: T): Promise<T> {
    try {
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