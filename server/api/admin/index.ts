import { Router } from 'express'
import passport from 'passport'

import UserService from '../../services/user.service'
import { isApiServiceError } from '../../interfaces/services/errors/apiServiceError.interface'

const router = Router()
// TODO -> Singleton DI Factory pattern?
const userService = new UserService()

const jwtAuth = passport.authenticate('jwt', { session: false })

// TODO -> role middleware
router.get('/users', jwtAuth, (_req, res) => {
  const users = userService.list()

  return res.json({ users })
})

// TODO -> role middleware
router.post('/user', jwtAuth, (req, res) => {
  try {
    const result = userService.setUserRoles(
      req.body.user.id,
      req.body.user.roles
    )

    return res.send(result)
  } catch (error) {
    if (isApiServiceError(error)) {
      return res.status(error.statusCode).json({ messages: [error.message] })
    } else {
      return res.status(500)
    }
  }
})

export default router
