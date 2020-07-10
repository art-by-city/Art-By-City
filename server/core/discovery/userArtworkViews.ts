import { Collection } from 'fireorm'

@Collection('UserArtworkViews')
export default class UserArtworkViews {
  id!: string
  userId!: string
  lastFetchedArtworkId!: string
}
