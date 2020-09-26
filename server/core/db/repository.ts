import { getRepository, BaseFirestoreRepository, IEntity, Instantiable } from 'fireorm'
import { injectable } from 'inversify'
import DocumentMapper from '../api/documentMapper'

import Document from '../common/document'

interface TrackableEntity extends IEntity {
  created: Date
  updated: Date
}

@injectable()
export default class BaseRepositoryImpl<
  DE extends TrackableEntity,
  DOC extends Document
> {
  private documentClass: Instantiable<DOC>
  private mapper: DocumentMapper<DE, DOC>
  protected repository: BaseFirestoreRepository<DOC>

  constructor(
    documentClass: Instantiable<DOC>,
    mapper: DocumentMapper<DE, DOC>
  ) {
    this.documentClass = documentClass
    this.mapper = mapper
    this.repository = getRepository(documentClass)
  }

  async create(thing: DE): Promise<DE> {
    try {
      thing.created = new Date()
      thing.updated = thing.created
      const doc = this.mapper.toDocument(thing)
      const savedDoc = await this.repository.create(doc)

      return this.mapper.
    } catch (error) {
      throw new Error(`Error creating new ${this.documentClass.name}: ${error.message}`)
    }
  }

  get(id: string): Promise<DE | null> {
    try {
      return this.repository.findById(id)
    } catch (error) {
      throw new Error(`Error getting ${this.documentClass.name} by id: ${error.message}`)
    }
  }

  list(): Promise<DE[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error listing ${this.documentClass.name}: ${error.message}`)
    }
  }

  findOne(): Promise<DE | null> {
    try {
      return this.repository.findOne()
    } catch (error) {
      throw new Error(`Error finding one ${this.documentClass.name}: ${error.message}`)
    }
  }

  update(thing: DE): Promise<DE> {
    try {
      thing.updated = new Date()
      return this.repository.update(thing)
    } catch (error) {
      throw new Error(`Error updating ${this.documentClass.name}: ${error.message}`)
    }
  }

  delete(id: string): Promise<void> {
    try {
      return this.repository.delete(id)
    } catch (error) {
      throw new Error(`Error deleting ${this.documentClass.name}: ${error.message}`)
    }
  }
}