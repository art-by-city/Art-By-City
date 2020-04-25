import { Router } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../../auth-strategies/jwt'
import { User, addUser, updateUser, resetPassword } from '../../db/local/users'
import {
  validateUsername,
  validatePassword
} from '../../../helpers/validation/user'

const router = Router()

router.post('/login', passport.authenticate('local'), (req, res) => {
  const user = req.user || {}

  const token = jwt.sign(user, JWT_SECRET)

  return res.json({ user, token })
})

router.post('/logout', (_req, res) => {
  return res.send()
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

  const validationMessages = validateUsername(username).concat(
    validatePassword(password)
  )

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

router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = <User>req.user || {}

    const validationMessages = validatePassword(req.body.newPassword)

    if (validationMessages.length > 0) {
      return res.status(400).json({ messages: validationMessages })
    }

    const updated = updateUser(user.id, req.body.password, req.body.newPassword)

    if (updated) {
      return res.send(true)
    }

    return res.status(404).json({ messages: ['User not found'] })
  }
)

router.post('/forgot', (req, res) => {
  const updated = resetPassword(req.body.username, req.body.newPassword)

  const validationMessages = validatePassword(req.body.newPassword)

  if (validationMessages.length > 0) {
    return res.status(400).json({ messages: validationMessages })
  }

  if (updated) {
    return res.send(true)
  }

  return res.status(404).json({ messages: ['User not found'] })
})

export default router
