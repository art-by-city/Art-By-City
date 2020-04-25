import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../../auth-strategies/jwt'
import { User, addUser } from '../../db/local/users'
import { validateUserFields } from '../../../helpers/validation/user'

const router = Router()

router.post('/login', passport.authenticate('local'), (req, res) => {
  const user = req.user || {}

  const token = jwt.sign(user, JWT_SECRET)

  return res.json({ user, token })
})

router.post('/logout', (_req, res) => {
  return res.send('OK')
})

router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.user || {}

    return res.json({ user })
  }
)

router.put('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const validationMessages = validateUserFields(username, password)

  if (validationMessages.length > 0) {
    return res.status(400).json({ messages: validationMessages })
  }

  addUser(username, password, (err: Error, user: User) => {
    if (err) {
      return res.status(409).json({ messages: [err.message] })
    }

    const token = jwt.sign(user, JWT_SECRET)

    return res.json({ user, token })
  })
})

export default router
