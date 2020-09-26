import { ArtworkImage } from './'
import Entity from '../common/entity'
import { User } from '../user'
import { City } from '../city'

export default class Artwork extends Entity {
  owner!: User
  title!: string
  description!: string
  type!: string
  city!: City
  hashtags!: string[]
  images!: ArtworkImage[]
  likes!: string[]
  published!: boolean
  approved!: boolean

  constructor(data?: {
    id?: string,
    created?: Date,
    updated?: Date,
    user?: User,
    title?: string,
    description?: string,
    type?: string,
    city?: City,
    hashtags?: string[],
    images?: ArtworkImage[]
  }) {
    super(data)

    this.owner = data?.user || new User()
    this.title = data?.title || ''
    this.description = data?.description || ''
    this.type = data?.type || ''
    this.city = data?.city || new City()
    this.hashtags = data?.hashtags || []
    this.images = data?.images || []
  }
}
