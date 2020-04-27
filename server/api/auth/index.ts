import { Router } from 'express'
import passport from 'passport'

import { User } from '../../core/auth/user'
import UserValidator from '../../core/validators/user'
import LocalAuthService from '../../services/auth.service'
import UserService from '../../services/user.service'
import { isApiServiceError } from '../../interfaces/services/errors/apiServiceError.interface'

const router = Router()
// TODO -> Singleton DI Factory pattern?
const userService = new UserService()
const authService = new LocalAuthService(userService)
const userValidator = new UserValidator()

const localAuth = passport.authenticate('local')
const jwtAuth = passport.authenticate('jwt', { session: false })

/**
 * This function is only reached after successful auth
 */
router.post('/login', localAuth, (req, res) => {
  const result = authService.login(<User>req.user)

  return res.json(result)
})

router.post('/logout', (_req, res) => {
  return res.send()
})

router.get('/user', jwtAuth, (req, res) => {
  const user = <User>req.user

  return res.json({ user })
})

router.put('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  const messages = userValidator.validate(username, password)

  if (messages) {
    return res.status(400).json({ messages })
  }

  try {
    const result = authService.register(username, password)

    return res.json(result)
  } catch (error) {
    return res.status(409).json({ messages: [error.message] })
  }
})

router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = <User>req.user
    const currentPassword = req.body.password
    const newPassword = req.body.newPassword

    const messages = userValidator.validatePassword(newPassword)

    if (messages) {
      return res.status(400).json({ messages })
    }

    try {
      const result = userService.updatePassword(
        user,
        currentPassword,
        newPassword
      )

      // TODO -> Update displayname?

      return res.send(result)
    } catch (error) {
      if (isApiServiceError(error)) {
        return res.status(error.statusCode).json({ messages: [error.message] })
      } else {
        return res.status(500)
      }
    }
  }
)

router.post('/forgot', (req, res) => {
  const messages = userValidator.validatePassword(req.body.newPassword)

  if (messages) {
    return res.status(400).json({ messages })
  }

  if (messages) {
    return res.status(400).json({ messages })
  }

  try {
    const updated = userService.resetPassword(
      req.body.username,
      req.body.newPassword
    )

    if (updated) {
      return res.send(true)
    }
  } catch (error) {
    if (isApiServiceError(error)) {
      return res.status(error.statusCode).json({ messages: [error.message] })
    } else {
      return res.status(500)
    }
  }
})

export default router
