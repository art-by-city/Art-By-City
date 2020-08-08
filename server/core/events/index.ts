import { ContainerModule } from 'inversify'

import EventServiceImpl from './service'
import UserEventServiceImpl from './user/userEventService'
import UserEventRepositoryImpl from './user/userEventRepository'
import {
  UserEventType,
  UserEventService,
  UserEventRepository
} from './user'
import { ArtworkEventType } from './artwork'

export type EventType =
  | UserEventType
  | ArtworkEventType

export interface EventService {
  registerEvents(): void
  on(type: EventType, listener: (...args: any[]) => void): void
  emit(event: EventType, ...args: any[]): void
}

export const EventModule = new ContainerModule((bind) => {
  bind<EventService>(Symbol.for('EventService'))
    .to(EventServiceImpl)
    .inSingletonScope()

  bind<UserEventService>(Symbol.for('UserEventService'))
    .to(UserEventServiceImpl)

  bind<UserEventRepository>(Symbol.for('UserEventRepository'))
    .to(UserEventRepositoryImpl)
})
