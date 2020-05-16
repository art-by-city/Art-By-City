import { injectable } from 'inversify'
import * as fireorm from 'fireorm'
import { Firestore } from '@google-cloud/firestore'

import DatabaseAdapter from './adapter.interface'

@injectable()
export default class FirebaseAdapter implements DatabaseAdapter {
  private firestore!: Firestore

  initialize() {
    // TODO -> from environment
    this.firestore = new Firestore({
      projectId: 'art-by-city-dev',
      host: 'localhost',
      port: 8080,
      ssl: false
    })
    fireorm.initialize(this.firestore)
  }

  getClient() {
    if (!this.firestore) {
      this.initialize()
    }
    return this.firestore
  }
}
