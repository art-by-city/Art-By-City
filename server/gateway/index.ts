import { ContainerModule } from 'inversify'
import { Storage } from '@google-cloud/storage'

import StorageGateway from './storage'

export interface GatewayAdapter<T> {
  getClient(): T
}

export default new ContainerModule((bind) => {
  bind<GatewayAdapter<Storage>>(Symbol.for('StorageGateway')).to(
    StorageGateway
  ).inSingletonScope()
})
