import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import * as firestorm from 'firebase-firestorm'

import { container } from '../../inversify.config'
import AuthService from '../../services/auth/authService.interface'
import AdminController from '../controllers/admin/adminController.interface'
import AuthController from './auth/authController.interface'
import ArtworkController from './artwork/artworkController'

// Firebase Config

// TODO -> from environment
const firebaseConfig = {
  // apiKey: 'AIzaSyBkodltb2uToinQwT8kkRk2x7FvvGmaCmU',
  // authDomain: 'art-by-city-staging.firebaseapp.com',
  // databaseURL: 'https://art-by-city-staging.firebaseio.com',
  projectId: 'art-by-city-staging'
  // storageBucket: 'art-by-city-staging.appspot.com',
  // messagingSenderId: '298867075063',
  // appId: '1:298867075063:web:71c1cfa4f8707c61da30f2'
}

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()
const db = firebaseApp.firestore()
db.settings({ host: 'localhost:8080', ssl: false })
firestorm.initialize(db)

// Authentication / Passport Config

const authService = container.get<AuthService>(Symbol.for('AuthService'))

passport.use(authService.getLocalAuthenticationStrategy())
passport.use(authService.getJwtAuthenticationStrategy())
passport.serializeUser(authService.serializeAccount)
passport.deserializeUser(authService.deserializeAccount)

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

export default app
