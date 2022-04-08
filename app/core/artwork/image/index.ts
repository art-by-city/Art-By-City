import { TrackableEntity } from '~/app/core'
import {
  ArtworkImageWithPreviews,
  BaseArtwork,
  BaseArtworkCreationOptions,
  BaseArtworkManifest,
  URLArtworkImage
} from '..'

export interface ImageArtworkCreationOptions
  extends BaseArtworkCreationOptions
{
  type?: string
  medium?: string
  images: (URLArtworkImage & TrackableEntity)[]
}

export interface ImageArtworkManifest extends BaseArtworkManifest {
  medium?: string
  type?: string
  images: ArtworkImageWithPreviews[]
}

export interface ImageArtwork extends BaseArtwork {
  medium?: string
  type?: string
  images: (ArtworkImageWithPreviews & TrackableEntity)[]
}

export { default as ImageArtworkFactory } from './factory'
