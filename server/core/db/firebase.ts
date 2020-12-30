import { injectable } from 'inversify'
import * as fireorm from 'fireorm'
import { Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from './adapter.interface'

@injectable()
export default class FirebaseAdapter implements DatabaseAdapter {
  private firestore!: Firestore

  initialize() {
    this.firestore = new Firestore({
      projectId: process.env.GCP_PROJECT_ID,
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || '8080'),
      ssl: process.env.DB_SSL === 'true'
    })
    fireorm.initialize(this.firestore, { validateModels: false })
  }

  getClient() {
    if (!this.firestore) {
      this.initialize()
    }
    return this.firestore
  }
}
