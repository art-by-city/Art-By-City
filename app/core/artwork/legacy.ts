import { ArtworkImageWithPreviews } from './artwork'
import { TrackableEntity } from '../common'

export interface LegacyArtwork extends LegacyArtworkManifest {
  version: 0
  id: string
  images: (ArtworkImageWithPreviews & TrackableEntity)[]
}

export interface LegacyArtworkManifest {
  version?: 0
  published?: Date
  creator: { address: string }
  title: string
  slug?: string
  created?: number
  description?: string
  type?: string
  images: ArtworkImageWithPreviews[]
  license?: {
    reference: string
    detailsUrl: string
    name: string
    licenseId: string
    seeAlso: string[]
  }
  medium?: string
  city?: string
}

export interface LegacyArtworkImage {
  imageType: string
  dataUrl: string
}

export interface ArtworkType {
  name: string
  visible?: boolean
  enabled?: boolean
}

export interface ArtworkOptions {
  city: string,
  type: string,
  hashtags: string[],
  limit: number
}
