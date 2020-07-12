import { injectable, inject } from 'inversify'
import { Express } from 'express'
import { EventEmitter } from 'events'

import { HashtagApplicationService } from '../hashtag'
import { EventService } from './'

@injectable()
export default class EventServiceImpl implements EventService {
  private eventEmitter!: EventEmitter
  private hashtagAppService: HashtagApplicationService

  constructor(
    @inject(Symbol.for('HashtagApplicationService'))
    hashtagAppService: HashtagApplicationService
  ) {
    this.eventEmitter = new EventEmitter()
    this.hashtagAppService = hashtagAppService
  }

  emit(event: string | symbol, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args)
  }

  registerEvents(): void {
    this.hashtagAppService.registerEvents(this.eventEmitter)
  }
}
