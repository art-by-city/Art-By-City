export interface ImageFileRef {
  source: string
  thumbX?: number
  thumbY?: number
  width?: number
  height?: number
}

export interface ImageUploadRequest {
  data: string
  type: string
  thumbX?: number
  thumbY?: number
  width?: number
  height?: number
}

export interface ImageUploadPreview {
  ascii: string
  type: string
  thumbX?: number
  thumbY?: number
  width?: number
  height?: number
}

export type ArtworkImageFile =
  | ImageFileRef
  | ImageUploadRequest
  | ImageUploadPreview
  | File

export async function calcImageDimensions(image: ArtworkImageFile):
  Promise<{ width: number, height: number}> {
  return new Promise((resolve, reject) => {
    let img = new Image()

    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      reject('Image loading error')
    }

    const source = getImageSource(image)

    if (!source) {
      reject('No image source')
    }

    img.src = source
  })
}

export function getImageSource(image: ArtworkImageFile) {
  if (isImageFileRef(image)) {
    return `/artwork-images/${(<ImageFileRef>image).source}`
  }

  if (isImageUploadPreview(image)) {
    return `data:${image.type};base64, ${image.ascii}`
  }

  return ''
}

export function getImagePosition(
  image: ArtworkImageFile,
  bounds?: { width: number, height: number }
) {
  let top = 0, left = 0,
      imgHeight = 500, imgWidth = 500

  if (!isFile(image)) {
    let offsetY = image.thumbY || 0,
        offsetX = image.thumbX || 0,
        boundsHeight = bounds?.height || imgHeight,
        boundsWidth = bounds?.width || imgWidth,
        percY = ((100 * boundsHeight) / imgHeight) / 100,
        percX = ((100 * boundsWidth) / imgWidth) / 100

    top = offsetY * percY
    left = offsetX * percX
  }

  if (top === 0 && left === 0) {
    return 'center'
  }

  return `left ${left}px top ${top}px`
}

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
