import { injectable, inject } from 'inversify'

import UsernameAlreadyTakenError from '../api/errors/usernameAlreadyTakenError'
import UnknownError from '../api/errors/unknownError'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import ValidationError from '../api/errors/validationError'
import NotFoundError from '../api/errors/notFoundError'
import UserValidator from './validator'
import { User, UserService, UserRepository } from './'

@injectable()
export default class UserServiceImpl implements UserService {
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
      throw new NotFoundError(new User())
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

  register(username: string, password: string): Promise<User> {
    const validator = new UserValidator()

    const messages = validator.validate(username, password)

    if (messages) {
      throw new ValidationError(messages)
    }

    try {
      const user = new User()
      user.username = username
      user.password = password

      return this.userRepository.create(user)
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

  listUsers(): Promise<User[]> {
    return this.userRepository.list()
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

  async saveUser(user: User): Promise<ApiServiceResult<void>> {
    const savedUser = await this.userRepository.update(user)

    if (!savedUser) {
      return { success: false, messages: ['Could not save user'] }
    }

    return { success: true }
  }
}
