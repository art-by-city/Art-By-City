import { injectable, inject } from 'inversify'

import UsernameAlreadyTakenError from '../api/errors/usernameAlreadyTakenError'
import UnknownError from '../api/errors/unknownError'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import ValidationError from '../api/errors/validationError'
import NotFoundError from '../api/errors/notFoundError'
import { EventService } from '../events'
import UserValidator from './validator'
import { User, UserService, UserRepository } from './'
import { UserEvents } from '../events/user'

@injectable()
export default class UserServiceImpl implements UserService {
  private userRepository: UserRepository
  private eventService: EventService

  constructor(
    @inject(Symbol.for('UserRepository'))
    userRepository: UserRepository,
    @inject(Symbol.for('EventService'))
    eventService: EventService
  ) {
    this.userRepository = userRepository
    this.eventService = eventService
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

  async register(username: string, password: string): Promise<User> {
    const validator = new UserValidator()

    const messages = validator.validate(username, password)

    if (messages) {
      throw new ValidationError(messages)
    }

    try {
      const user = new User()
      user.username = username
      user.password = password

      const savedUser = await this.userRepository.create(user)

      this.eventService.emit(UserEvents.Account.Registered, savedUser.id)

      return savedUser
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
