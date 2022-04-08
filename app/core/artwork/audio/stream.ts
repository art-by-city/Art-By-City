// import _process from 'process'
// import ffmpeg from 'ffmpeg.js/ffmpeg-mp4'
// const ffmpeg = require('ffmpeg.js/ffmpeg-mp4')
import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg'

// window.process.stdout = {
//   write: (val: string) => { console.log(val); return true }
// }
// if (process.browser) {
//   process = _process
// }
export default class StreamFactory {
  ffmpeg!: FFmpeg

  constructor() {
    this.ffmpeg = createFFmpeg({
      log: true
    })
  }

  async create(audio: Uint8Array): Promise<Uint8Array> {
    if (!this.ffmpeg.isLoaded()) {
      await this.ffmpeg.load()
    }

    this.ffmpeg.FS('writeFile', './audio.test', audio)

    await this.ffmpeg.run(
      '-i', './audio.test',
      '-codec:a', 'aac',
      '-b:a', '256k',
      '-movflags', '+faststart',
      'stream.m4a'
    )

    return this.ffmpeg.FS('readFile', './stream.m4a')
  }
}
