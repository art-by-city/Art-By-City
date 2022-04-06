import { TrackableEntity } from '~/app/core'
import {
  ArtworkImageWithPreviews,
  BaseArtwork,
  BaseArtworkCreationOptions,
  BaseArtworkManifest,
  URLArtworkImage
} from '..'

export interface AudioArtworkCreationOptions
  extends BaseArtworkCreationOptions
{
  image: (TrackableEntity & URLArtworkImage)
  audio: (TrackableEntity & URLArtworkAudio)
}

export interface AudioArtworkManifest extends BaseArtworkManifest {
  image: ArtworkImageWithPreviews,
  audio: ArtworkAudioWithStream
}

export interface AudioArtwork extends BaseArtwork {
  image: TrackableEntity & ArtworkImageWithPreviews
  audio: TrackableEntity & ArtworkAudioWithStream
}

export interface URLArtworkAudio {
  url: string
  type: string
}

export interface ArtworkAudioWithStream {
  audio: string
  stream: string
}
