import { BaseArtwork } from '~/app/core/artwork'
import { FactoryCreationError } from '~/app/core/error'
import { ModelArtwork, ModelArtworkManifest } from '.'
import { uuidv4 } from '~/app/util'

export default class ModelArtworkFactory {
  create(
    base: BaseArtwork,
    opts: Partial<ModelArtworkManifest>
  ): ModelArtwork {
    if (!opts.image) {
      throw new FactoryCreationError('missing image')
    }

    if (!opts.model) {
      throw new FactoryCreationError('missing model')
    }

    const modelArtwork: ModelArtwork = {
      ...base,
      image: { guid: uuidv4(), ...opts.image },
      model: { guid: uuidv4(), ...opts.model }
    }

    return modelArtwork
  }
}
