import { Container } from 'inversify'

import { UserModule } from './core/user'
import { AdminModule } from './core/admin'
import { AuthModule } from './core/auth'
import { ArtworkModule } from './core/artwork'
import { CityModule } from './core/city'
import DatabaseModule from './core/db/module'

const container = new Container()

container.load(UserModule)
container.load(AdminModule)
container.load(AuthModule)
container.load(ArtworkModule)
container.load(CityModule)
container.load(DatabaseModule)

export { container }
