import { ContainerModule } from 'inversify'

import DatabaseAdapterInterface from './adapter.interface'
import FirebaseAdapter from './firebase'

export default new ContainerModule((bind) => {
  bind<DatabaseAdapterInterface>(Symbol.for('DatabaseAdapter')).to(
    FirebaseAdapter
  )
})
