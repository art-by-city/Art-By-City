import { AudioArtworkCreationOptions, AudioArtworkManifest } from './audio'
import { ImageArtworkCreationOptions, ImageArtworkManifest } from './image'

export interface BaseArtworkCreationOptions {
  created?: number
  creator: string
  title: string
  slug: string
  description?: string
  city?: string
  license?: License
}

export interface BaseArtworkManifest {
  version: 1
  published: Date
  created?: number
  creator: string
  title: string
  slug: string
  description?: string
  city?: string
  license?: License
}

export interface BaseArtwork extends BaseArtworkManifest {
  id: string
}

export interface URLArtworkImage { url: string, type: string }

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

export type ArtworkCreationOptions =
  | ImageArtworkCreationOptions
  | AudioArtworkCreationOptions

export type ArtworkManifest =
  | ImageArtworkManifest
  | AudioArtworkManifest

export * from './legacy'
