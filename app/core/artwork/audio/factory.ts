import { AudioArtwork, AudioArtworkManifest } from '.'
import { uuidv4 } from '../../../util'
import { FactoryCreationError } from '../../error'
import { BaseArtwork } from '../artwork'

export default class AudioArtworkFactory {
  create(
    base: BaseArtwork,
    opts: Partial<AudioArtworkManifest>
  ): AudioArtwork {
    if (!opts.image) {
      throw new FactoryCreationError('missing image')
    }

    if (!opts.audio) {
      throw new FactoryCreationError('missing audio')
    }

    return {
      ...base,
      genre: opts.genre,
      image: { guid: uuidv4(), ...opts.image },
      audio: { guid: uuidv4(), ...opts.audio }
    }
  }
}
