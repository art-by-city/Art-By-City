import { Bundle, bundleAndSignData, DataItem } from 'arbundles'

import { readFileAsArrayBufferAsync } from '~/app/util'
import {
  ArtworkCreationOptions,
  ArtworkImageWithPreviews,
  ImageArtworkCreationOptions,
  AudioArtworkCreationOptions,
  AudioArtworkManifest,
  ImageArtworkManifest,
  ArtworkManifest,
  BaseArtworkManifest,
  ArtworkAudioWithStream,
  PreviewFactory
} from '~/app/core/artwork'
import {
  BundleFactory,
  DataItemFactory,
  SignerFactory
} from '~/app/infra/arweave'
// import { FactoryCreationError } from '../../error'

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
          logCb()
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

    let processedAudio: DataItem[][] = []
    let manifest: ArtworkManifest
    if ("images" in opts) {
      manifest = this.createImageArtworkManifest(opts, processedImages)
    } else {
      const blob = await fetch(opts.audio.url).then(r => r.blob())
      const buffer = await readFileAsArrayBufferAsync(blob)
      const audio = new Uint8Array(buffer)

      // const streamEncoder = new StreamFactory(({ ratio }) => {
      //   if (logCb) {
      //     logCb(ratio)
      //   }
      // })
      // const stream = await streamEncoder.create(audio)

      // if (!stream.length) {
      //   throw new FactoryCreationError(
      //     'Error encoding streamable copy of audio'
      //   )
      // }

      processedAudio = [[
        // await DataItemFactory.create(
        //   stream,
        //   signer,
        //   [{ name: 'Content-Type', value: 'audio/mp4' }]
        // ),
        await DataItemFactory.create(
          audio,
          signer,
          [{ name: 'Content-Type', value: opts.audio.type }]
        )
      ]]

      manifest = this.createAudioArtworkManifest(
        opts,
        processedImages,
        processedAudio
      )
    }

    const manifestDataItem = await DataItemFactory.create(
      JSON.stringify(manifest),
      signer,
      [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'slug', value: opts.slug },
        { name: 'Category', value: 'artwork' },
        { name: 'Sub-Category', value: opts.subCategory },
        { name: 'App-Name', value: this.appName },
        { name: 'App-Version', value: this.appVersion },
        { name: 'Protocol', value: 'ArtByCity' }
      ]
    )

    return {
      bundle: BundleFactory.create([
        manifestDataItem,
        ...processedImages.flat(),
        ...processedAudio.flat()
      ]),
      manifestId: manifestDataItem.id
    }
  }

  private createBaseManifest(
    opts: ArtworkCreationOptions
  ): BaseArtworkManifest {
    return {
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
  }

  private createImageArtworkManifest(
    opts: ImageArtworkCreationOptions,
    imageItems: DataItem[][]
  ): ImageArtworkManifest {
    const base = this.createBaseManifest(opts)

    return {
      ...base,
      type: opts.type,
      medium: opts.medium,
      images: imageItems.map(mapImagePreviewDataItemsForManifest)
    }
  }

  private createAudioArtworkManifest(
    opts: AudioArtworkCreationOptions,
    imageItems: DataItem[][],
    audioItems: DataItem[][]
  ): AudioArtworkManifest {
    const base = this.createBaseManifest(opts)

    return {
      ...base,
      genre: opts.genre,
      image: mapImagePreviewDataItemsForManifest(imageItems[0]),
      audio: mapAudioPreviewDataItemsForManifest(audioItems[0])
    }
  }
}

function mapAudioPreviewDataItemsForManifest(
  // [stream, audio]: DataItem[],
  [ audio ]: DataItem[],
  _index?: number,
  _array?: DataItem[][]
): ArtworkAudioWithStream {
  return {
    audio: audio.id,
    // stream: stream.id
  }
}

function mapImagePreviewDataItemsForManifest(
  [preview, preview4k, image]: DataItem[],
  _index?: number,
  _array?: DataItem[][]
): ArtworkImageWithPreviews {
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
}
