import { injectable } from 'inversify'
import * as fireorm from 'fireorm'
import { Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from './adapter.interface'

@injectable()
export default class FirebaseAdapter implements DatabaseAdapter {
  private firestore!: Firestore

  initialize() {
    const isProduction = process.env.NODE_ENV === 'production'
                         || process.env.NODE_ENV === 'staging'
    const firestoreOpts: any = {
      projectId: process.env.GCP_PROJECT_ID
    }

    if (!isProduction) {
      firestoreOpts.host = process.env.DB_HOST
      firestoreOpts.port = Number.parseInt(process.env.DB_PORT || '8080')
      firestoreOpts.ssl = process.env.DB_SSL === 'true'
    } else {
      firestoreOpts.keyFilename = process.env.GAC
    }

    this.firestore = new Firestore(firestoreOpts)
    fireorm.initialize(this.firestore, { validateModels: false })
  }

  getClient() {
    if (!this.firestore) {
      this.initialize()
    }
    return this.firestore
  }
}
