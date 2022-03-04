import { TrackableEntity } from '..'

export * from './legacy'

export interface ArtworkCreationOptions {
  created?: number
  creator: string
  title: string
  slug: string
  description?: string
  type?: string
  medium?: string
  city?: string
  license?: License
  images: (URLArtworkImage & TrackableEntity)[]
}

export interface URLArtworkImage { url: string, type: string }

export interface ArtworkManifest {
  version: 1
  published: Date
  created?: number
  creator: string
  title: string
  slug: string
  description?: string
  type?: string
  images: ArtworkImageWithPreview[]
  license?: License
  medium?: string
  city?: string
}

export interface Artwork extends ArtworkManifest {
  id: string
  images: (ArtworkImageWithPreview & TrackableEntity)[]
}

type ArtworkImageWithPreview = { image: string, preview: string }

export interface License {
  reference: string
  detailsUrl: string
  name: string
  licenseId: string
  seeAlso: string[]
}

/**
 * LEGACY
 */
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
