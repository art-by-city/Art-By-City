export interface ImageFileRef {
  source: string
}

export interface ImageUploadRequest {
  data: string
  type: string
}

export interface ImageUploadPreview {
  ascii: string
  type: string
}

export type ArtworkImageFile =
  | ImageFileRef
  | ImageUploadRequest
  | ImageUploadPreview
  | File

export function isImageFileRef(file: ArtworkImageFile): file is ImageFileRef {
  return (file as ImageFileRef).source !== undefined
}

export function isImageUploadRequest(file: ArtworkImageFile): file is ImageUploadRequest {
  return (file as ImageUploadRequest).type !== undefined
}

export function isImageUploadPreview(file: ArtworkImageFile): file is ImageUploadPreview {
  return (file as ImageUploadPreview).ascii !== undefined
}

export function isFile(file: ArtworkImageFile): file is File {
  return !isImageFileRef(file)
    && !isImageUploadRequest(file)
    && !isImageUploadPreview(file)
}

export function getImageSource(image: ArtworkImageFile, baseUrl: string) {
  if (isImageFileRef(image)) {
    return `${baseUrl}/artwork-images/${image.source}`
  }

  if (isImageUploadPreview(image)) {
    return `data:${image.type};base64, ${image.ascii}`
  }

  return ''
}

export default interface Artwork {
  id: string
  created: Date
  updated: Date
  title: string
  slug: string
  owner: {
    id: string
    username: string
  }
  description: string
  type: string
  city: string
  hashtags: string[]
  images: ArtworkImageFile[]
  likes: string[]
  published: boolean
  approved: boolean
}

export interface NewArtworkRequest {
  owner: {
    id: string
    username: string
  }
  title: string
  slug: string
  description?: string
  type: string
  city: string
  hashtags?: string[]
  images: ArtworkImageFile[]
}
