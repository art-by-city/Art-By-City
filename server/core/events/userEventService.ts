import { injectable, inject } from 'inversify'
import { EventEmitter } from 'events'

import {
  UserEventService,
  UserArtworkViewEvent,
  UserEventRepository,
  UserEvents,
  UserEventType,
  UserAccountRegisteredEvent
} from './'

@injectable()
export default class UserEventServiceImpl implements UserEventService {
  private userEventRepository: UserEventRepository

  constructor(
    @inject(Symbol.for('UserEventRepository'))
    userEventRepository: UserEventRepository
  ) {
    this.userEventRepository = userEventRepository
  }

  on(eventEmitter: EventEmitter, type: UserEventType, listener: (...args: any[]) => void): void {
    eventEmitter.on(type, listener.bind(this))
  }

  registerEvents(eventEmitter: EventEmitter): void {
    this.on(eventEmitter, UserEvents.Artwork.Viewed, this.onUserArtworkView)
    this.on(eventEmitter, UserEvents.Account.Registered, this.onUserAccountRegistered)
  }

  onUserArtworkView(userId: string, artworkId: string) {
    try {
      this.userEventRepository.create(new UserArtworkViewEvent(userId, artworkId))
    } catch (error) {
      console.error(error)
    }
  }

  onUserAccountRegistered(userId: string) {
    try {
      this.userEventRepository.create(new UserAccountRegisteredEvent(userId))
    } catch (error) {
      console.error(error)
    }
  }
}