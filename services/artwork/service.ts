import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

import ProgressService from '~/services/progress/service'
import ToastService from '~/services/toast/service'
import { readFileAsBinaryStringAsync } from '~/helpers/helpers'
import Artwork, { ImageUploadRequest, isFile, isImageUploadPreview } from '~/models/artwork/artwork'

export default class ArtworkService {
  context!: Context
  $axios!: NuxtAxiosInstance

  constructor(context: Context) {
    this.context = context
    this.$axios = context.$axios
  }

  async createArtwork(artwork: Artwork): Promise<Artwork | undefined> {
    ProgressService.start()
    try {
      artwork.images = await Promise.all(artwork.images.map(async (image) => {
        return {
          data: await readFileAsBinaryStringAsync(<File>image),
          type: (<File>image).type
        } as ImageUploadRequest
      }))

      const { payload } = await this.$axios.$post(
        '/api/artwork',
        { artwork }
      )

      if (payload) {
        ToastService.success('artwork created')

        return payload
      }
    } catch (error) {
      ToastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }

  async updateArtwork(artwork: Artwork): Promise<Artwork | undefined> {
    ProgressService.start()
    try {
      artwork.images = await Promise.all(artwork.images.map(async (image) => {
        if (isFile(image)) {
          return {
            type: image.type,
            data: await readFileAsBinaryStringAsync(image)
          } as ImageUploadRequest
        }

        if (isImageUploadPreview(image)) {
          return {
            type: image.type,
            data: atob(image.ascii)
          } as ImageUploadRequest
        }

        return image
      }))

      const { payload } = await this.$axios.$put(
        `/api/artwork/${artwork.id}`,
        { artwork }
      )

      if (payload) {
        ToastService.success('artwork updated')

        return payload
      }
    } catch (error) {
      ToastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }
}
