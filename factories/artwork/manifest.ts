import { DataItem } from 'arbundles'

import { Artwork, ArtworkManifest } from '~/types'

export default class ArtworkManifestFactory {
  static create(artwork: Artwork, imageItems: DataItem[]): ArtworkManifest {
    return {
      published: new Date(),
      created: artwork.created,
      creator: artwork.creator,
      title: artwork.title,
      slug: artwork.slug,
      description: artwork.description,
      type: artwork.type,
      medium: artwork.medium,
      city: artwork.city?.toLowerCase(),
      license: artwork.license,
      images: imageItems.map(item => {
        return {
          id: item.id,
          preview: item.id
        }
      })
    }
  }
}