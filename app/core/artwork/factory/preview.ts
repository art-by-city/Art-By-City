export default class PreviewFactory {
  private canvas!: HTMLCanvasElement

  constructor() {
    this.canvas = document.createElement('canvas')
  }

  async create(
    url: string,
    opts: { maxHeight: number, maxWidth: number, type: string }
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image()

      image.onerror = () => {
        reject('Error generating image preview while loading src')
      }

      image.onload = () => {
        const { naturalWidth, naturalHeight } = image

        let scale = 1
        if (naturalWidth > opts.maxWidth || naturalHeight > opts.maxHeight) {
          const horizontallyOriented = naturalWidth > naturalHeight
          const wScale = opts.maxWidth / (horizontallyOriented ? naturalWidth : naturalHeight)
          const hScale = opts.maxHeight / (horizontallyOriented ? naturalHeight : naturalWidth)
          scale = wScale < hScale ? wScale : hScale
        }

        this.canvas.width = naturalWidth * scale
        this.canvas.height = naturalHeight * scale

        const ctx = this.canvas.getContext('2d')
        ctx!.imageSmoothingEnabled = true
        ctx!.imageSmoothingQuality = 'low'
        ctx!.fillStyle = 'white'
        ctx!.fillRect(0, 0, this.canvas.width, this.canvas.height)
        ctx!.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)

        this.canvas.toBlob(blob => {
          if (blob) {
            resolve(URL.createObjectURL(blob))
          } else {
            reject('Error generating image preview from canvas')
          }
        }, opts.type)
      }

      image.src = url
    })
  }
}
