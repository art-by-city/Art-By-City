import { TrackableEntity } from '../common'

export interface LegacyArtwork extends LegacyArtworkManifest {
  version: 0
  id: string
  images: (LegacyArtworkImage & TrackableEntity)[]
}

export interface LegacyArtworkManifest {
  published: Date
  creator: { address: string }
  title: string
  slug: string
  created?: number
  description?: string
  type?: string
  images: LegacyArtworkImage[]
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