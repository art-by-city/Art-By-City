import { User } from '../core/auth/user'
import {
  addUser,
  updateUser,
  resetPassword,
  listUsers,
  setUserRoles
} from '../db/local/users'
import ApiServiceResult from '../interfaces/services/results/apiServiceResult.interface'
import UserNotFoundError from './errors/userNotFound.error'

export default class UserService {
  create(username: string, password: string): User {
    return addUser(username, password)
  }

  updatePassword(
    user: User,
    currentPassword: string,
    newPassword: string
  ): ApiServiceResult {
    const updated = updateUser(user.id, currentPassword, newPassword)

    if (updated) {
      return { success: true }
    }

    throw new UserNotFoundError()
  }

  resetPassword(username: string, newPassword: string): ApiServiceResult {
    const updated = resetPassword(username, newPassword)

    if (updated) {
      return { success: true }
    }

    throw new UserNotFoundError()
  }

  list(): User[] {
    return listUsers()
  }

  setUserRoles(id: string, roles: string[]): ApiServiceResult {
    const updated = setUserRoles(id, roles)

    if (updated) {
      return { success: true }
    }

    throw new UserNotFoundError()
  }
}
