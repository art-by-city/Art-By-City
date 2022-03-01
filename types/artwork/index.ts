import { TrackableEntity } from '../common'

export interface Artwork {
  id: string
  published?: Date
  created?: number
  creator: ArtworkCreator
  title: string
  slug?: string
  description?: string
  type?: string
  hashtags: string[]
  images: ArtworkImage[]
  license?: License
  medium?: string
  city?: string
}

export interface ArtworkCreator {
  address: string
}

export type ArtworkImage = DataURLArtworkImage

export interface BaseArtworkImage extends TrackableEntity {
  id?: string
  imageType: string
}

export interface ArrayBufferArtworkImage extends BaseArtworkImage {
  buffer: ArrayBuffer
}

export interface URLArtworkImage extends BaseArtworkImage {
  url: string
}

export interface DataURLArtworkImage extends BaseArtworkImage {
  dataUrl: string
}

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
