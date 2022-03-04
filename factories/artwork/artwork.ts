import { Artwork } from '~/types'
import { IFactory, FactoryCreationError } from '../'

export default class ArtworkFactory implements IFactory<Artwork> {
  create(opts: Partial<Artwork>): Artwork {
    if (!opts.id) {
      throw new FactoryCreationError('missing id')
    }

    if (!opts.creator) {
      throw new FactoryCreationError('missing creator')
    }

    if (!opts.title) {
      throw new FactoryCreationError('missing title')
    }

    if (!opts.images) {
      throw new FactoryCreationError('missing images')
    }

    if (!opts.slug) {
      throw new FactoryCreationError('missing slug')
    }

    const artwork: Artwork = {
      id: opts.id,
      published: opts.published,
      creator: opts.creator,
      title: opts.title,
      hashtags: opts.hashtags || [],
      images: opts.images,
      slug: opts.slug,
      ...opts
    }

    return artwork
  }
}
