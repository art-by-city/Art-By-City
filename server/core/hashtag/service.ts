import { injectable, inject } from 'inversify'

import { HashtagService, HashtagRepository, Hashtag } from '.'

@injectable()
export default class HashtagServiceImpl implements HashtagService {
  private hashtagRepository: HashtagRepository

  constructor(
    @inject(Symbol.for('HashtagRepository'))
    hashtagRepository: HashtagRepository
  ) {
    this.hashtagRepository = hashtagRepository
  }

  create(hashtag: Hashtag): Promise<Hashtag | null> {
    return this.hashtagRepository.create(hashtag)
  }

  get(id: string): Promise<Hashtag | null> {
    return this.hashtagRepository.get(id)
  }

  update(hashtag: Hashtag): Promise<Hashtag | null> {
    return this.hashtagRepository.update(hashtag)
  }

  delete(id: string): Promise<void> {
    return this.hashtagRepository.delete(id)
  }

  list(): Promise<Hashtag[]> {
    return this.hashtagRepository.find()
  }

  async createOrUpdate(hashtag: string): Promise<void> {
    const _hashtag = hashtag.toLowerCase()
    const hashtagEntity = await this.hashtagRepository.findByHashtag(_hashtag)

    if (!hashtagEntity) {
      this.create({
        id: '',
        created: new Date(),
        updated: new Date(),
        hashtag: _hashtag
      })
    }
  }
}