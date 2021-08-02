import { TrackableEntity } from '../common'

export interface Artwork {
  id?: string
  published?: Date
  creator: ArtworkCreator
  title: string
  slug?: string
  description?: string
  type?: string
  hashtags: string[]
  images: ArtworkImage[]
}

export interface ArtworkCreator {
  address: string
}

export type ArtworkImage = DataURLArtworkImage

export interface BaseArtworkImage extends TrackableEntity {
  id?: string
  imageType: string
}

export interface DataURLArtworkImage extends BaseArtworkImage {
  dataUrl: string
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
