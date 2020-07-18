import { injectable, inject } from 'inversify'
import { EventEmitter } from 'events'

import { HashtagApplicationService, HashtagService } from './'
import { ArtworkEvents } from '../events/artwork'

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
    eventEmitter.on(ArtworkEvents.Hashtag.Added, this.onHashtagAdded.bind(this))
  }

  onHashtagAdded(hashtag: string) {
    try {
      this.hashtagService.createOrUpdate(hashtag)
    } catch (error) {
      console.error(error)
    }
  }
}