import { EventEmitter } from 'events'

import BaseRepositoryInterface from '../../infra/repository.interface'
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
export type UserArtworkUpdated = 'user:artwork:updated'
export type UserAccountRegistered = 'user:account:registered'
export type UserAccountLoggedIn = 'user:account:loggedin'
export type UserAccountForgotPassword = 'user:account:forgotpw'
export type UserEventType =
  | UserArtworkViewed
  | UserArtworkCreated
  | UserArtworkDeleted
  | UserArtworkUpdated
  | UserAccountRegistered
  | UserAccountLoggedIn
  | UserAccountForgotPassword

export const UserEvents = {
  Artwork: {
    Viewed: 'user:artwork:viewed' as UserArtworkViewed,
    Created: 'user:artwork:created' as UserArtworkCreated,
    Deleted: 'user:artwork:deleted' as UserArtworkDeleted,
    Updated: 'user:artwork:updated' as UserArtworkUpdated
  },
  Account: {
    Registered: 'user:account:registered' as UserAccountRegistered,
    ForgotPassword: 'user:account:forgotpw' as UserAccountForgotPassword,
    LoggedIn: 'user:account:loggedin' as UserAccountLoggedIn
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
