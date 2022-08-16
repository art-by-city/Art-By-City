import { FactoryCreationError } from '~/app/core/error'
import { Artwork, ArtworkManifest, BaseArtwork } from '../artwork'
import { AudioArtworkFactory } from '../audio'
import { ImageArtworkFactory } from '../image'
import { ModelArtworkFactory } from '../model'

export default class ArtworkFactory {
  create(
    id: string,
    opts: Partial<ArtworkManifest>
  ): Artwork {
    if (!id) {
      throw new FactoryCreationError('missing id')
    }

    if (!opts.creator) {
      throw new FactoryCreationError('missing creator')
    }

    if (!opts.title) {
      throw new FactoryCreationError('missing title')
    }

    const base: BaseArtwork = {
      ...opts,
      id,
      version: opts.version || 0,
      published: opts.published || new Date(),
      creator: opts.creator,
      title: opts.title,
      slug: opts.slug,
    }

    if ('images' in opts) {
      return new ImageArtworkFactory().create(base, opts)
    } else if ('audio' in opts) {
      return new AudioArtworkFactory().create(base, opts)
    } else if ('model' in opts) {
      return new ModelArtworkFactory().create(base, opts)
    }

    throw new FactoryCreationError('Could not parse Artwork Manifest')
  }
}
