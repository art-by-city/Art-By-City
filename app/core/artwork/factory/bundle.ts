import { Bundle, DataItem } from 'arbundles'

import { readFileAsArrayBufferAsync } from '~/app/util'
import {
  ArtworkCreationOptions,
  ArtworkImageWithPreviews,
  ImageArtworkCreationOptions,
  AudioArtworkCreationOptions,
  AudioArtworkManifest,
  ImageArtworkManifest,
  ArtworkManifest,
  BaseArtworkManifest
} from '~/app/core/artwork'
import { PreviewFactory } from '~/app/infra/image'
import {
  BundleFactory,
  DataItemFactory,
  SignerFactory
} from '~/app/infra/arweave'

const animatedImageTypes = [
  'image/apng',
  'image/avif',
  'image/gif',
  'image/webp'
]

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
  ): Promise<{ bundle: Bundle, manifestId: string }> {
    const signer = await SignerFactory.create()
    const resizer = new PreviewFactory()

    const images = "images" in opts ? opts.images : [opts.image]
    const processedImages = await Promise.all(
      images.map(async ({ url, type }, idx) => {
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

    const manifest = this.createManifest(opts, processedImages)
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

    return {
      bundle: BundleFactory.create([
        manifestDataItem,
        ...processedImages.flat()
      ]),
      manifestId: manifestDataItem.id
    }
  }

  private createManifest(
    opts: ArtworkCreationOptions,
    imageItems: DataItem[][]
  ): ArtworkManifest {
    const manifest: BaseArtworkManifest = {
      version: 1,
      published: new Date(),
      created: opts.created,
      creator: opts.creator,
      title: opts.title,
      slug: opts.slug,
      description: opts.description,
      city: opts.city?.toLowerCase(),
      license: opts.license,
    }

    if ("images" in opts) {
      const imageManifest: ImageArtworkManifest = {
        ...manifest,
        type: opts.type,
        medium: opts.medium,
        images: imageItems.map(([preview, preview4k, image]) => {
          const imageWithPreview: ArtworkImageWithPreviews = {
            image: image.id,
            preview: preview.id,
            preview4k: preview4k.id
          }

          const isAnimated = image.tags.some(
            tag =>
              tag.name === 'Content-Type'
              && animatedImageTypes.includes(tag.value)
          )

          if (isAnimated) {
            imageWithPreview.animated = true
          }

          return imageWithPreview
        })
      }

      return imageManifest
    } else if ("audio" in opts) {
      throw new Error('Artwork Type Not Yet Implemented')
      // const audioManifest: AudioArtworkManifest = {
      //   ...manifest,
      //   image: 'TODO',
      //   audio: 'TODO'
      // }

      // return audioManifest
    }

    throw new Error('Artwork Type Not Yet Implemented')
  }
}
