import { rootCollection, field, map } from 'firebase-firestorm'
import DomainEntity from '../domainEntity'

import ArtworkInterface, {
  ArtworkType,
  ArtworkImageInterface,
  Region
} from './artwork.interface'

export class ArtworkImage implements ArtworkImageInterface {
  @field({ name: 'source' })
  source!: string
}

@rootCollection({ name: 'artworks' })
export default class Artwork extends DomainEntity implements ArtworkInterface {
  @field({ name: 'title' })
  title!: string

  @field({ name: 'description' })
  description!: string

  @field({ name: 'type' })
  type!: ArtworkType

  @field({ name: 'region' })
  region!: Region

  @field({ name: 'hashtags' })
  hashtags!: string[]

  @map({ name: 'images', entity: ArtworkImage })
  images!: ArtworkImage[]
}
