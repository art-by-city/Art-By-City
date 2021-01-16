import { injectable } from 'inversify'
import { Storage } from '@google-cloud/storage'

import { GatewayAdapter } from '.'

@injectable()
export default class StorageGateway implements GatewayAdapter<Storage> {
  client!: Storage

  initialize() {
    const storageOpts = {
      projectId: process.env.GCP_PROJECT_ID || 'art-by-city-dev'
    }
    this.client = new Storage(storageOpts)
  }

  getClient(): Storage {
    if (!this.client) {
      this.initialize()
    }

    return this.client
  }
}
