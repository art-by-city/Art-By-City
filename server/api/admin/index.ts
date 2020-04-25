import { Router } from 'express'
import passport from 'passport'

import { listUsers, setUserRoles } from '../../db/local/users'

const router = Router()

// TODO -> role middleware
router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (_req, res) => {
    return res.json({ users: listUsers() })
  }
)

// TODO -> role middleware
router.post(
  '/user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.body.user) {
      const updated = setUserRoles(req.body.user.id, req.body.user.roles)

      if (updated) {
        return res.send(true)
      }
    }

    return res.send(400)
  }
)

export default router
