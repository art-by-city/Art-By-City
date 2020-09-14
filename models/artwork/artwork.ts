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

export default interface Artwork {
  id: string
  created: Date
  updated: Date
  title: string
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
