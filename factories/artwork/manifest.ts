import { DataItem } from 'arbundles'

import { ArtworkCreationOptions, ArtworkManifest } from '~/types'

export default class ArtworkManifestFactory {
  static create(
    artwork: ArtworkCreationOptions,
    imageItems: DataItem[][]
  ): ArtworkManifest {
    return {
      version: 1,
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
      images: imageItems.map(([image, preview]) => {
        return {
          image: image.id,
          preview: preview.id
        }
      })
    }
  }
}