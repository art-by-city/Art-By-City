import Transaction from 'arweave/node/lib/transaction'

import { Artwork, TrackableEntity } from '..'

export interface FeedItem extends TrackableEntity {
  tx: Transaction,
  artwork: Artwork
}
