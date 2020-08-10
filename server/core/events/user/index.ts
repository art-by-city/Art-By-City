import { EventEmitter } from 'events'

import BaseRepositoryInterface from '../../repository.interface'
import UserEvent from './userEvent'

export { default as UserEvent } from './userEvent'
export { default as UserEventViewModel } from './viewModels/userEventViewModel'
export { default as UserArtworkViewedEvent } from './userArtworkViewedEvent'
export { default as UserArtworkCreatedEvent } from './userArtworkCreatedEvent'
export { default as UserArtworkDeletedEvent } from './userArtworkDeletedEvent'
export { default as UserAccountRegisteredEvent } from './userAccountRegisteredEvent'
export { default as UserAccountLoggedInEvent } from './userAccountLoggedInEvent'
export { default as UserAccountForgotPasswordEvent } from './userAccountForgotPasswordEvent'

export type UserArtworkViewed = 'user:artwork:viewed'
export type UserArtworkCreated = 'user:artwork:created'
export type UserArtworkDeleted = 'user:artwork:deleted'
export type UserAccountRegistered = 'user:account:registered'
export type UserAccountLoggedIn = 'user:account:loggedin'
export type UserAccountForgotPassword = 'user:account:forgotpw'
export type UserEventType =
  | UserArtworkViewed
  | UserArtworkCreated
  | UserArtworkDeleted
  | UserAccountRegistered
  | UserAccountLoggedIn
  | UserAccountForgotPassword

export const UserEvents = {
  Artwork: {
    Viewed: 'user:artwork:viewed',
    Created: 'user:artwork:created',
    Deleted: 'user:artwork:deleted'
  } as {
    Viewed: UserArtworkViewed,
    Created: UserArtworkCreated,
    Deleted: UserArtworkDeleted
  },
  Account: {
    Registered: 'user:account:registered',
    ForgotPassword: 'user:account:forgotpw',
    LoggedIn: 'user:account:loggedin'
  } as {
    Registered: UserAccountRegistered,
    ForgotPassword: UserAccountForgotPassword,
    LoggedIn: UserAccountLoggedIn
  }
}

export interface UserEventService {
  registerEvents(eventEmitter: EventEmitter): void
  on(eventEmitter: EventEmitter, event: UserEventType, listener: (...args: any[]) => void): void
  fetchEvents(): Promise<UserEvent[]>
}

export interface UserEventFilterOptions {}

export interface UserEventRepository
  extends BaseRepositoryInterface<UserEvent, UserEventFilterOptions> {}
