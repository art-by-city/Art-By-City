import {
  BaseArtwork,
  ImageArtwork,
  ArtworkImageWithPreviews,
  ImageArtworkManifest,
  LegacyArtwork,
  LegacyArtworkManifest
} from '~/app/core/artwork'
import { FactoryCreationError } from '~/app/core/error'
import { uuidv4 } from '~/app/util'

export default class ImageArtworkFactory {
  create(
    base: BaseArtwork,
    opts: Partial<ImageArtworkManifest> | Partial<LegacyArtworkManifest>
  ): ImageArtwork | LegacyArtwork {
    if (!opts.images) {
      throw new FactoryCreationError('missing images')
    }

    if ('version' in opts && opts.version) {
      if (!opts.published) {
        throw new FactoryCreationError('missing published')
      }

      return {
        ...base,
        medium: opts.medium,
        type: opts.type,
        images: opts.images.map(image => {
          return { guid: uuidv4(), ...image }
        }),
      }
    } else {
      const artwork: LegacyArtwork = {
        ...base,
        version: 0,
        creator: opts.creator as { address: string },
        type: opts.type,
        medium: opts.medium,
        images: (opts.images as ArtworkImageWithPreviews[]).map(image => {
          return { guid: uuidv4(), ...image }
        })
      }

      return artwork
    }
  }
}
