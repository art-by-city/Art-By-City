import { injectable, inject } from 'inversify'
import { DocumentReference, Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from '../db/adapter.interface'
import BaseRepositoryImpl from '../db/repository'
import { Invitation, InvitationRepository, InvitationFilterOptions } from './'

@injectable()
export default class InvitationRepositoryImpl
  extends BaseRepositoryImpl<Invitation>
  implements InvitationRepository {

  constructor(
    @inject(Symbol.for('DatabaseAdapter'))
    databaseAdapter: DatabaseAdapter
  ) {
    super(Invitation)
    this.client = databaseAdapter.getClient()
  }

  getDocumentReference(id: string): DocumentReference<Invitation> {
    return <DocumentReference<Invitation>>this.client.doc(`Invitations/${id}`)
  }

  find(_filter?: InvitationFilterOptions | undefined): Promise<Invitation[]> {
    try {
      return this.repository.find()
    } catch (error) {
      throw new Error(`Error finding invitations: ${error.message}`)
    }
  }
  private client: Firestore
}
