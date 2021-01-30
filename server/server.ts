import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import _ from 'lodash'
import * as dotenv from 'dotenv'

import { container } from './inversify.config'
import DatabaseAdapter from './core/db/adapter.interface'
import { AuthController, AuthService } from './core/auth'
import { AdminController } from './core/admin'
import { ArtworkController } from './core/artwork'
import { UserController, UserApplicationService } from './core/user'
import { CityController } from './core/city'
import { ConfigController } from './core/config'
import { EventService } from './core/events'
import { AnalyticsController } from './core/analytics'
import {
  InvitationController,
  InvitationApplicationService
} from './core/invitation'
import { FileApplicationService } from './core/file'
import { ChangelogController } from './core/changelog'

dotenv.config()

// Initialize Database
const databaseAdapter = container.get<DatabaseAdapter>(
  Symbol.for('DatabaseAdapter')
)
databaseAdapter.initialize()

// Authentication / Passport Config
const authService = container.get<AuthService>(Symbol.for('AuthService'))
passport.use(authService.getLocalAuthenticationStrategy())
passport.use(authService.getJwtAuthenticationStrategy())
passport.serializeUser(authService.serializeUser)
passport.deserializeUser(authService.deserializeUser)

// Express App
const app = express()

// Initialize Controllers that have unique upload limits first
app.use(
  '/artwork',
  container.get<ArtworkController>(Symbol.for('ArtworkController')).getRouter()
)
app.use(
  '/user',
  container.get<UserController>(Symbol.for('UserController')).getRouter()
)

// Express Config
app.use(passport.initialize())
app.use(bodyParser.json())

// Express Routing
app.use(
  '/auth',
  container.get<AuthController>(Symbol.for('AuthController')).getRouter()
)
app.use(
  '/admin',
  container.get<AdminController>(Symbol.for('AdminController')).getRouter()
)
app.use(
  '/changelog',
  container.get<ChangelogController>(Symbol.for('ChangelogController')).getRouter()
)
app.use(
  '/city',
  container.get<CityController>(Symbol.for('CityController')).getRouter()
)
app.use(
  '/config',
  container.get<ConfigController>(Symbol.for('ConfigController')).getRouter()
)
app.use(
  '/analytics',
  container.get<AnalyticsController>(Symbol.for('AnalyticsController')).getRouter()
)
app.use(
  '/invitations',
  container.get<InvitationController>(Symbol.for('InvitationController')).getRouter()
)

// Event Registration
container
  .get<EventService>(Symbol.for('EventService'))
  .registerEvents()
container
  .get<UserApplicationService>(Symbol.for('UserApplicationService'))
  .registerEvents()
container
  .get<InvitationApplicationService>(Symbol.for('InvitationApplicationService'))
  .registerEvents()
container
  .get<FileApplicationService>(Symbol.for('FileApplicationService'))
  .registerEvents()

export default app
