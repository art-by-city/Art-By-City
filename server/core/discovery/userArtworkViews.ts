import { Collection } from 'fireorm'

export interface ArtworkView {
  [artworkId: string]: number
}

@Collection()
export default class UserArtworkViews {
  id!: string
  userId!: string
  views!: ArtworkView[]
}
