export interface ImageFileRef {
  source: string
}

export interface ImageUploadRequest {
  data: string
  type: string
}

export type ArtworkImageFile =
  | ImageFileRef
  | ImageUploadRequest
  | File

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
