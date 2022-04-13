import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg'

export default class StreamFactory {
  ffmpeg!: FFmpeg

  constructor(progressCb: ({ ratio }: { ratio: number }) => void) {
    this.ffmpeg = createFFmpeg({
      log: process.env.NODE_ENV !== 'production',
      progress: progressCb
    })
  }

  async create(audio: Uint8Array): Promise<Uint8Array> {
    if (!this.ffmpeg.isLoaded()) {
      await this.ffmpeg.load()
    }

    this.ffmpeg.FS('writeFile', './audio.test', audio)

    await this.ffmpeg.run(
      '-i', './audio.test',
      '-vn',
      '-map', 'a',
      '-codec:a', 'aac',
      '-b:a', '256k',
      '-movflags', '+faststart',
      'stream.m4a'
    )

    return this.ffmpeg.FS('readFile', './stream.m4a')
  }
}
