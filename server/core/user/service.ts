import { injectable, inject } from 'inversify'

import UsernameAlreadyTakenError from '../api/errors/usernameAlreadyTakenError'
import UnknownError from '../api/errors/unknownError'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import NotFoundError from '../api/errors/notFoundError'
import { EventService } from '../events'
import validateUser from './validator'
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

  async register(req: any): Promise<User> {
    const user = new User()
    user.id = ''
    user.created = new Date()
    user.updated = new Date()
    user.username = req.body?.username || ''
    user.password = req.body?.password || ''
    user.city = req.body?.city || ''
    user.roles = []
    user.artworkCount = 0

    await validateUser(user)

    try {
      const savedUser = await this.userRepository.create(user)

      this.eventService.emit(UserEvents.Account.Registered, savedUser.id)

      return savedUser
    } catch (error) {
      // TODO -> Other errors
      throw new UsernameAlreadyTakenError()
    }
  }

  async updatePassword(
    id: string,
    password: string
  ): Promise<ApiServiceResult<void>> {
    const validatePasswordUser = new User()
    validatePasswordUser.password = password

    await validateUser(validatePasswordUser, true)

    const user = await this.userRepository.get(id)

    if (!user) {
      throw new NotFoundError(new User())
    }

    try {
      user.updatePassword(password)
      user.updated = new Date()

      const updatedUser = await this.userRepository.update(user)

      if (!updatedUser) {
        return { success: false }
      }

      return { success: true }
    } catch (error) {
      throw new UnknownError(error.message)
    }
  }

  async setUserRoles(
    userId: string,
    roles: string[]
  ): Promise<ApiServiceResult<void>> {
    const validateRolesUser = new User()
    validateRolesUser.roles = roles

    await validateUser(validateRolesUser, true)

    const user = await this.userRepository.get(userId)

    if (!user) {
      return { success: false, messages: ['User not found'] }
    }

    try {
      user.setRoles(roles)
      user.updated = new Date()

      const savedUser = await this.userRepository.update(user)

      if (!savedUser) {
        throw new NotFoundError(new User())
      }

      return { success: true }
    } catch (error) {
      return { success: false, messages: ['Could not save user'] }
    }
  }

  // Admin only?
  async saveUser(user: User): Promise<ApiServiceResult<void>> {
    await validateUser(user)

    try {
      user.updated = new Date()
      const savedUser = await this.userRepository.update(user)

      if (!savedUser) {
        throw new NotFoundError(new User())
      }

      return { success: true }
    } catch (error) {
      return { success: false, messages: ['Could not save user'] }
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

  incrementUserArtworkCount(userId: string): Promise<void> {
    return this.userRepository.incrementUserArtworkCount(userId)
  }

  decrementUserArtworkCount(userId: string): Promise<void> {
    return this.userRepository.decrementUserArtworkCount(userId)
  }
}
