import { Artwork, TrackableEntity } from '..'

export interface FeedItem extends TrackableEntity {
  artwork: Artwork
}
