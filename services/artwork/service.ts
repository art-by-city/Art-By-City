import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

import ProgressService from '~/services/progress/service'
import { readFileAsDataUrlAsync } from '~/helpers/helpers'
import Artwork, {
  ArtworkImageFile,
  ImageFileRef,
  ImageUploadRequest,
  isFile,
  isImageUploadPreview,
  NewArtworkRequest
} from '~/models/artwork/artwork'

export default class ArtworkService {
  context!: Context
  $axios!: NuxtAxiosInstance

  constructor(context: Context) {
    this.context = context
    this.$axios = context.$axios
  }

  private async prepareArtworkImageForUpload(image: ArtworkImageFile):
    Promise<ImageFileRef | ImageUploadRequest> {
    if (isFile(image)) {
      const imgData = await readFileAsDataUrlAsync(image)
      return {
        type: image.type,
        data: imgData.split(',')[1]
      } as ImageUploadRequest
    }

    if (isImageUploadPreview(image)) {
      return {
        type: image.type,
        data: image.ascii
      } as ImageUploadRequest
    }

    return image
  }

  async createArtwork(artwork: Artwork | NewArtworkRequest):
    Promise<Artwork | undefined> {
    ProgressService.start()
    try {
      artwork.images = await Promise.all(
        artwork.images.map(async (image: ArtworkImageFile) => {
          return this.prepareArtworkImageForUpload(image)
        })
      )

      const { payload } = await this.$axios.$post(
        '/api/artwork',
        { artwork }
      )

      if (payload) {
        this.context.$toastService.success('artwork created')

        return payload
      }
    } catch (error) {
      this.context.$toastService.error(
        error.response.status === 413
        ? 'Artwork images must be less than 200MB'
        : error
      )
    } finally {
      ProgressService.stop()
    }
  }

  async updateArtwork(artwork: Artwork): Promise<Artwork | undefined> {
    ProgressService.start()
    try {
      artwork.images = await Promise.all(artwork.images.map(async (image) => {
        return this.prepareArtworkImageForUpload(image)
      }))

      const { payload } = await this.$axios.$put(
        `/api/artwork/${artwork.id}`,
        { artwork }
      )

      if (payload) {
        this.context.$toastService.success('artwork updated')

        return payload
      }
    } catch (error) {
      this.context.$toastService.error(
        error.response.status === 413
        ? 'Artwork images must be less than 200MB'
        : error
      )
    } finally {
      ProgressService.stop()
    }
  }

  async fetchForAdmin(): Promise<Artwork[]> {
    ProgressService.start()
    try {
      const { payload } = await this.$axios.$get('/api/admin/artwork')

      if (payload) {
        return payload
      }
    } catch (error) {
      this.context.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }

    return []
  }
}
