import { Bundle, DataItem } from 'arbundles'

import { readFileAsArrayBufferAsync } from '~/helpers'
import { ArtworkCreationOptions, ArtworkManifest } from '~/types'
import { BundleFactory, DataItemFactory, SignerFactory } from '..'
import PreviewFactory from './preview'

export default class ArtworkBundleFactory {
  appName!: string
  appVersion!: string

  constructor(appName: string, appVersion: string) {
    this.appName = appName
    this.appVersion = appVersion
  }

  async create(
    opts: ArtworkCreationOptions,
    logCb?: Function
  ): Promise<Bundle> {
    const signer = await SignerFactory.create()
    const resizer = new PreviewFactory()

    const images = await Promise.all(
      opts.images.map(async ({ url, type }, idx) => {
        const previewType = 'image/jpeg'
        const previewUrl = await resizer.create(url, {
          maxWidth: 1920,
          maxHeight: 1080,
          type: previewType
        })
        const preview4kUrl = await resizer.create(url, {
          maxWidth: 3840,
          maxHeight: 2160,
          type: previewType
        })

        const blob = await fetch(url).then(r => r.blob())
        const buffer = await readFileAsArrayBufferAsync(blob)
        const image = new Uint8Array(buffer)

        const previewBlob = await fetch(previewUrl).then(r => r.blob())
        const previewBuffer = await readFileAsArrayBufferAsync(previewBlob)
        const preview = new Uint8Array(previewBuffer)

        const preview4kBlob = await fetch(preview4kUrl).then(r => r.blob())
        const preview4kBuffer = await readFileAsArrayBufferAsync(preview4kBlob)
        const preview4k = new Uint8Array(preview4kBuffer)

        if (logCb) {
          logCb({ idx })
        }

        return [
          await DataItemFactory.create(
            preview,
            signer,
            [{ name: 'Content-Type', value: previewType }]
          ),
          await DataItemFactory.create(
            preview4k,
            signer,
            [{ name: 'Content-Type', value: previewType }]
          ),
          await DataItemFactory.create(
            image,
            signer,
            [{ name: 'Content-Type', value: type }]
          )
        ]
      })
    )

    const manifest = this.createManifest(opts, images)
    const manifestDataItem = await DataItemFactory.create(
      JSON.stringify(manifest),
      signer,
      [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'slug', value: opts.slug },
        { name: 'Category', value: 'artwork' },
        { name: 'App-Name', value: this.appName },
        { name: 'App-Version', value: this.appVersion }
      ]
    )

    return BundleFactory.create([ manifestDataItem, ...images.flat() ])
  }

  private createManifest(
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
      images: imageItems.map(([preview, preview4k, image]) => {
        return {
          image: image.id,
          preview: preview.id,
          preview4k: preview4k.id
        }
      })
    }
  }
}
