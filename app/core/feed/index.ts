import { DomainEntityCategory, TrackableEntity } from '../common'

export interface FeedItem extends TrackableEntity {
  txId: string
  category: DomainEntityCategory
  cursor?: string
}
