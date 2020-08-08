import { injectable, inject } from 'inversify'
import { EventEmitter } from 'events'

import { HashtagApplicationService } from '../hashtag'
import { EventService, EventType } from './'
import { UserEventService } from './user'
import { UserApplicationService } from '../user'

@injectable()
export default class EventServiceImpl implements EventService {
  public eventEmitter!: EventEmitter
  private hashtagAppService: HashtagApplicationService
  private userEventService: UserEventService

  constructor(
    @inject(Symbol.for('HashtagApplicationService'))
    hashtagAppService: HashtagApplicationService,
    @inject(Symbol.for('UserEventService'))
    userEventService: UserEventService
  ) {
    this.eventEmitter = new EventEmitter()
    this.hashtagAppService = hashtagAppService
    this.userEventService = userEventService
  }

  on(type: EventType, listener: (...args: any[]) => void): void {
    this.eventEmitter.on(type, listener)
  }

  emit(event: EventType, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args)
  }

  registerEvents(): void {
    this.hashtagAppService.registerEvents(this.eventEmitter)
    this.userEventService.registerEvents(this.eventEmitter)
  }
}
