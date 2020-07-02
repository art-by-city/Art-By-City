import { Collection } from 'fireorm'

import { User } from '../user'
import { ArtworkType, ArtworkImage } from './'

@Collection()
export default class Artwork {
  id!: string
  owner!: string | User
  title!: string
  description!: string
  type!: ArtworkType
  city!: string
  hashtags!: string[]
  images!: ArtworkImage[]
  likes!: string[]
}
