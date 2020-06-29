import { Collection, SubCollection, ISubCollection } from 'fireorm'

import { User } from '../user'
import { ArtworkType, ArtworkImage, Region } from './'

export class UserArtworkViews {
  id!: string
  userId!: string
  views: number = 0
}

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

  @SubCollection(UserArtworkViews, 'UserArtworkViews')
  userViews?: ISubCollection<UserArtworkViews>
}
