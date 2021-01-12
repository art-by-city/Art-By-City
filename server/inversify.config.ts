import { Container } from 'inversify'

import { UserModule } from './core/user'
import { AdminModule } from './core/admin'
import { AuthModule } from './core/auth'
import { ArtworkModule } from './core/artwork'
import { CityModule } from './core/city'
import { DiscoveryModule } from './core/discovery'
import { HashtagModule } from './core/hashtag'
import { ConfigModule } from './core/config'
import { EventModule } from './core/events'
import { AnalyticsModule } from './core/analytics'
import { InvitationModule } from './core/invitation'
import { EmailModule } from './core/email'
import { FileModule } from './core/file'
import GatewayModule from './gateway'
import DatabaseModule from './core/db/module'

const container = new Container()

container.load(UserModule)
container.load(AdminModule)
container.load(AuthModule)
container.load(ArtworkModule)
container.load(CityModule)
container.load(DiscoveryModule)
container.load(HashtagModule)
container.load(ConfigModule)
container.load(EventModule)
container.load(AnalyticsModule)
container.load(InvitationModule)
container.load(EmailModule)
container.load(FileModule)
container.load(GatewayModule)
container.load(DatabaseModule)

export { container }
