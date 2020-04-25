import {
  Strategy as JWTStrategy,
  StrategyOptions,
  ExtractJwt
} from 'passport-jwt'

import { findUserById } from '../db/local/users'

const JWT_SECRET = 'TODO_REAL_JWT_SECRET'

const strategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}

export default new JWTStrategy(strategyOptions, (jwtPayload, next) => {
  const user = findUserById(jwtPayload.id)

  if (!user) {
    return next(null, false)
  }

  return next(null, user)
})

export { JWT_SECRET }
