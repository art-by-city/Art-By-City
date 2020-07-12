import { ContainerModule } from 'inversify'
import { Express } from 'express'

import EventServiceImpl from './service'

export interface EventService {
  registerEvents(): void
  emit(event: string | symbol, ...args: any[]): void
}

export const EventModule = new ContainerModule((bind) => {
  bind<EventService>(Symbol.for('EventService'))
    .to(EventServiceImpl)
    .inSingletonScope()
})
