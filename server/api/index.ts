import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
// import * as firebase from 'firebase/app'

import localAuthenticationStrategy from '../auth-strategies/local'
import jwtAuthenticationStrategy from '../auth-strategies/jwt'
import { serializeUser, deserializeUser } from '../db/local/users'

import auth from './auth'
import admin from './admin'

// TODO -> from environment
// const firebaseConfig = {
//   apiKey: 'AIzaSyBkodltb2uToinQwT8kkRk2x7FvvGmaCmU',
//   authDomain: 'art-by-city-staging.firebaseapp.com',
//   databaseURL: 'https://art-by-city-staging.firebaseio.com',
//   projectId: 'art-by-city-staging',
//   storageBucket: 'art-by-city-staging.appspot.com',
//   messagingSenderId: '298867075063',
//   appId: '1:298867075063:web:71c1cfa4f8707c61da30f2'
// }

// firebase.initializeApp(firebaseConfig)

passport.use(localAuthenticationStrategy)
passport.use(jwtAuthenticationStrategy)
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)

const app = express()

app.use(bodyParser.json())
app.use(passport.initialize())

app.use('/auth', auth)
app.use('/admin', admin)

export default app
