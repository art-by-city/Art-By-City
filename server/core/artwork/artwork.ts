import { Collection } from 'fireorm'
import { DocumentReference } from '@google-cloud/firestore'

import User from '../user/user'
import { ArtworkType, ArtworkImage, Region } from './artwork.interface'

@Collection()
export default class Artwork {
  id!: string

  owner!: DocumentReference<User> | User

  title!: string

  description!: string

  type!: ArtworkType

  region!: Region

  hashtags!: string[]

  images!: ArtworkImage[]
}
