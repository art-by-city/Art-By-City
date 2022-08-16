import { TrackableEntity } from '~/app/core'
import {
  ArtworkImageWithPreviews,
  BaseArtwork,
  BaseArtworkCreationOptions,
  BaseArtworkManifest,
  URLArtworkImage
} from '..'

export interface ModelArtworkCreationOptions
  extends BaseArtworkCreationOptions
{
  subCategory: 'model'
  image: TrackableEntity & URLArtworkImage
  model: TrackableEntity & URLArtworkModel
}

export interface ModelArtworkManifest extends BaseArtworkManifest {
  image: ArtworkImageWithPreviews,
  model: ArtworkModel
}

export interface ModelArtwork extends BaseArtwork {
  image: TrackableEntity & ArtworkImageWithPreviews
  model: TrackableEntity & ArtworkModel
}

export interface URLArtworkModel {
  url: string
  type: string
}

export interface ArtworkModel {
  model: string
}

export { default as ModelArtworkFactory } from './factory'
