import { Strategy as LocalStrategy } from 'passport-local'

import { authenticateUser } from '../db/local/users'

const authenticate = (username: string, password: string, next: Function) => {
  const user = authenticateUser(username, password)

  if (!user) {
    return next(null, false, { message: 'Invalid username or password' })
  }

  return next(null, user, { message: 'Successfully authenticated' })
}

export default new LocalStrategy(authenticate)
