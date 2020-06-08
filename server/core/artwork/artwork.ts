import { Collection } from 'fireorm'

import { User } from '../user'
import { ArtworkType, ArtworkImage, Region } from './'

@Collection()
export default class Artwork {
  id!: string

  owner!: string | User

  title!: string

  description!: string

  type!: ArtworkType

  region!: Region

  hashtags!: string[]

  images!: ArtworkImage[]

  likes!: string[]
}
