import { injectable, inject } from 'inversify'
import { EventEmitter } from 'events'

import { UserApplicationService, UserService } from './'
import { UserEvents } from '../events/user'
import { EventService } from '../events'

@injectable()
export default class UserApplicationServiceImpl implements UserApplicationService {
  private userService: UserService
  private eventService: EventService

  constructor(
    @inject(Symbol.for('UserService'))
    userService: UserService,
    @inject(Symbol.for('EventService'))
    eventService: EventService
  ) {
    this.userService = userService
    this.eventService = eventService
  }

  registerEvents() {
    this.eventService.on(UserEvents.Artwork.Created, this.onUserArtworkCreated.bind(this))
    this.eventService.on(UserEvents.Artwork.Deleted, this.onUserArtworkDeleted.bind(this))
  }

  onUserArtworkCreated(userId: string) {
    try {
      this.userService.incrementUserArtworkCount(userId)
    } catch (error) {
      console.error(error)
    }
  }

  onUserArtworkDeleted(userId: string) {
    try {
      this.userService.decrementUserArtworkCount(userId)
    } catch (error) {
      console.error(error)
    }
  }
}