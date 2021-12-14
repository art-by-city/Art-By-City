import { DomainEntityCategory, TrackableEntity } from '../'

export interface FeedItem extends TrackableEntity {
  txId: string
  category: DomainEntityCategory
}
