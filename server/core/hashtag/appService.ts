import { injectable, inject } from 'inversify'
import { EventEmitter } from 'events'

import { HashtagApplicationService, HashtagService } from './'

@injectable()
export default class HashtagApplicationServiceImpl implements HashtagApplicationService {
  private hashtagService: HashtagService

  constructor(
    @inject(Symbol.for('HashtagService'))
    hashtagService: HashtagService
  ) {
    this.hashtagService = hashtagService
  }

  registerEvents(eventEmitter: EventEmitter) {
    eventEmitter.on('hashtag:added', this.onHashtagAdded.bind(this))
  }

  onHashtagAdded(hashtag: string) {
    try {
      this.hashtagService.createOrUpdate(hashtag)
    } catch (error) {
      console.error(error)
    }
  }
}