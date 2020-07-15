import { ContainerModule } from 'inversify'
import { EventEmitter } from 'events'

import BaseRepositoryInterface from '../repository.interface'
import BaseDomainServiceInterface from '../domainService.interface'
import BaseApplicationServiceInterface from '../applicationService.interface'

import Hashtag from './hashtag'
import HashtagRepositoryImpl from './repository'
import HashtagServiceImpl from './service'
import HashtagApplicationServiceImpl from './appService'

export { default as Hashtag } from './hashtag'
export interface HashtagFilterOptions {}
export interface HashtagRepository
  extends BaseRepositoryInterface<Hashtag, HashtagFilterOptions> {
    findByHashtag(hashtag: string): Promise<Hashtag | null>
  }
export interface HashtagService extends BaseDomainServiceInterface<Hashtag> {
  createOrUpdate(hashtag: string): void
}
export interface HashtagApplicationService extends BaseApplicationServiceInterface {
  registerEvents(eventEmitter: EventEmitter): void
  onHashtagAdded(hashtag: string): void
}

export const HashtagModule = new ContainerModule((bind) => {
  bind<HashtagRepository>(Symbol.for('HashtagRepository')).to(
    HashtagRepositoryImpl
  )

  bind<HashtagService>(Symbol.for('HashtagService')).to(
    HashtagServiceImpl
  )

  bind<HashtagApplicationService>(Symbol.for('HashtagApplicationService')).to(
    HashtagApplicationServiceImpl
  )
})