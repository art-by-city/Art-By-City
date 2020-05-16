import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'

import { container } from './inversify.config'
import AuthService from './core/auth/service.interface'
import AdminController from './core/admin/controller.interface'
import AuthController from './core/auth/controller.interface'
import ArtworkController from './core/artwork/controller'
import DatabaseAdapter from './core/db/adapter.interface'
import UserController from './core/user/controller.interface'

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

// Express App Config / Routing
const app = express()
app.use(passport.initialize())
app.use(bodyParser.json())
app.use(
  '/auth',
  container.get<AuthController>(Symbol.for('AuthController')).getRouter()
)
app.use(
  '/admin',
  container.get<AdminController>(Symbol.for('AdminController')).getRouter()
)
app.use(
  '/artwork',
  container.get<ArtworkController>(Symbol.for('ArtworkController')).getRouter()
)
app.use(
  '/user',
  container.get<UserController>(Symbol.for('UserController')).getRouter()
)

export default app
