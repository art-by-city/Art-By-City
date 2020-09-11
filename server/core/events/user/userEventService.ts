import { injectable, inject } from 'inversify'
import { EventEmitter } from 'events'

import {
  UserEventService,
  UserArtworkViewedEvent,
  UserArtworkCreatedEvent,
  UserArtworkDeletedEvent,
  UserEventRepository,
  UserEvent,
  UserEvents,
  UserEventType,
  UserAccountRegisteredEvent,
  UserAccountLoggedInEvent,
  UserAccountForgotPasswordEvent
} from './'
import { Artwork } from '../../artwork'

@injectable()
export default class UserEventServiceImpl implements UserEventService {
  private userEventRepository: UserEventRepository

  constructor(
    @inject(Symbol.for('UserEventRepository'))
    userEventRepository: UserEventRepository
  ) {
    this.userEventRepository = userEventRepository
  }

  fetchEvents(): Promise<UserEvent[]> {
    return this.userEventRepository.list()
  }

  on(eventEmitter: EventEmitter, type: UserEventType, listener: (...args: any[]) => void): void {
    eventEmitter.on(type, listener.bind(this))
  }

  registerEvents(eventEmitter: EventEmitter): void {
    this.on(eventEmitter, UserEvents.Artwork.Viewed, this.onUserArtworkViewed)
    this.on(eventEmitter, UserEvents.Artwork.Created, this.onUserArtworkCreated)
    this.on(eventEmitter, UserEvents.Artwork.Deleted, this.onUserArtworkDeleted)
    this.on(eventEmitter, UserEvents.Account.Registered, this.onUserAccountRegistered)
    this.on(eventEmitter, UserEvents.Account.LoggedIn, this.onUserAccountLoggedIn)
    this.on(eventEmitter, UserEvents.Account.ForgotPassword, this.onUserAccountForgotPassword)
  }

  onUserArtworkViewed(userId: string, artworkId: string) {
    try {
      this.userEventRepository.create(new UserArtworkViewedEvent(userId, artworkId))
    } catch (error) {
      console.error(error)
    }
  }

  onUserArtworkCreated(userId: string, artworkId: string) {
    try {
      this.userEventRepository.create(new UserArtworkCreatedEvent(userId, artworkId))
    } catch (error) {
      console.error(error)
    }
  }

  onUserArtworkDeleted(userId: string, artwork: Artwork) {
    try {
      this.userEventRepository.create(new UserArtworkDeletedEvent(userId, artwork.id))
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

  onUserAccountLoggedIn(userId: string) {
    try {
      this.userEventRepository.create(new UserAccountLoggedInEvent(userId))
    } catch (error) {
      console.error(error)
    }
  }

  onUserAccountForgotPassword(userId: string) {
    try {
      this.userEventRepository.create(new UserAccountForgotPasswordEvent(userId))
    } catch (error) {
      console.error(error)
    }
  }
}