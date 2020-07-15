import { ContainerModule } from 'inversify'
import { EventEmitter } from 'events'

import BaseRepositoryInterface from '../repository.interface'
import EventServiceImpl from './service'
import UserEventServiceImpl from './userEventService'
import UserEvent from './userEvent'
import UserEventRepositoryImpl from './userEventRepository'

export { default as UserEvent } from './userEvent'
export { default as UserArtworkViewEvent } from './userArtworkViewedEvent'
export { default as UserAccountRegisteredEvent } from './userAccountRegisteredEvent'

export const UserEvents = {
  Artwork: {
    Viewed: 'user:artwork:viewed'
  } as {
    Viewed: UserEventTypes.ArtworkViewed
  },
  Account: {
    Registered: 'user:account:registered',
    ForgotPassword: 'user:account:forgotpw',
    LoggedIn: 'user:account:loggedin'
  } as {
    Registered: UserEventTypes.AccountRegistered,
    ForgotPassword: UserEventTypes.AccountForgotPassword,
    LoggedIn: UserEventTypes.AccountLoggedIn
  }
}

export namespace UserEventTypes {
  export type ArtworkViewed = 'user:artwork:viewed'
  export type ArtworkEvents = ArtworkViewed

  export type AccountRegistered = 'user:account:registered'
  export type AccountForgotPassword = 'user:account:forgotpw'
  export type AccountLoggedIn = 'user:account:loggedin'
  export type AccountEvents =
    | AccountRegistered
    | AccountForgotPassword
    | AccountLoggedIn
}

export type UserEventType =
  | UserEventTypes.ArtworkEvents
  | UserEventTypes.AccountEvents

export type EventType =
  | UserEventType

export interface EventService {
  registerEvents(): void
  emit(event: EventType, ...args: any[]): void
}

export interface UserEventService {
  registerEvents(eventEmitter: EventEmitter): void
  on(eventEmitter: EventEmitter, event: UserEventType, listener: (...args: any[]) => void): void
}

export interface UserEventFilterOptions {}

export interface UserEventRepository
  extends BaseRepositoryInterface<UserEvent, UserEventFilterOptions> {}

export const EventModule = new ContainerModule((bind) => {
  bind<EventService>(Symbol.for('EventService'))
    .to(EventServiceImpl)
    .inSingletonScope()

  bind<UserEventService>(Symbol.for('UserEventService'))
    .to(UserEventServiceImpl)

  bind<UserEventRepository>(Symbol.for('UserEventRepository'))
    .to(UserEventRepositoryImpl)
})
