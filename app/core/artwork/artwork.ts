import { TrackableEntity } from '../common'

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
  images: ArtworkImageWithPreviews[]
  license?: License
  medium?: string
  city?: string
}

export interface Artwork extends ArtworkManifest {
  id: string
  images: (ArtworkImageWithPreviews & TrackableEntity)[]
}

export type ArtworkImageWithPreviews = {
  image: string,
  preview: string,
  preview4k: string,
  animated?: boolean
}

export interface License {
  reference: string
  detailsUrl: string
  name: string
  licenseId: string
  seeAlso: string[]
}
