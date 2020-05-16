import { Container } from 'inversify'

import UserModule from './core/user/module'
import AdminModule from './core/admin/module'
import AuthModule from './core/auth/module'
import ArtworkModule from './core/artwork/module'
import DatabaseModule from './core/db/module'

const container = new Container()

container.load(UserModule)
container.load(AdminModule)
container.load(AuthModule)
container.load(ArtworkModule)
container.load(DatabaseModule)

export { container }
