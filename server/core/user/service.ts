import { injectable, inject } from 'inversify'

import UsernameAlreadyTakenError from '../api/errors/usernameAlreadyTakenError'
import UnknownError from '../api/errors/unknownError'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import ValidationError from '../api/errors/validationError'
import UserNotFoundError from '../api/errors/userNotFoundError'
import UserValidator from './validator'
import UserRepository from './repository.interface'
import User from './user'
import UserServiceInterface from './service.interface'

@injectable()
export default class UserService implements UserServiceInterface {
  private userRepository: UserRepository

  constructor(
    @inject(Symbol.for('UserRepository'))
    userRepository: UserRepository
  ) {
    this.userRepository = userRepository
  }

  async updatePassword(
    id: string,
    password: string
  ): Promise<ApiServiceResult<void>> {
    const validator = new UserValidator()

    const messages = validator.validatePassword(password)

    if (messages) {
      throw new ValidationError(messages)
    }
    const user = await this.userRepository.get(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    user.updatePassword(password)

    try {
      const updatedUser = await this.userRepository.update(user)

      if (!updatedUser) {
        return { success: false }
      }

      return { success: true }
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async register(username: string, password: string): Promise<User | null> {
    const validator = new UserValidator()

    const messages = validator.validate(username, password)

    if (messages) {
      throw new ValidationError(messages)
    }

    try {
      return await this.userRepository.create(username, password)
    } catch (error) {
      // TODO -> Other errors
      throw new UsernameAlreadyTakenError()
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getByUsername(username)

    if (!user || !user.verifyPassword(password)) {
      return null
    }

    return user
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userRepository.get(id)

    if (!user) {
      return null
    }

    return user
  }

  async listUsers(): Promise<User[]> {
    return await this.userRepository.list()
  }

  async setUserRoles(
    userId: string,
    roles: string[]
  ): Promise<ApiServiceResult<void>> {
    const user = await this.userRepository.get(userId)

    if (!user) {
      return { success: false, messages: ['User not found'] }
    }

    user.setRoles(roles)

    const savedUser = await this.userRepository.update(user)

    if (!savedUser) {
      return { success: false, messages: ['Could not save user'] }
    }

    return { success: true }
  }
}
