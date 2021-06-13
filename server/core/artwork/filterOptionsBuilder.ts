import { ArtworkFilterOptions } from '.'

export default class ArtworkFilterOptionsBuilder {
  static build(query: any): ArtworkFilterOptions {
    let opts: ArtworkFilterOptions = Object.assign<ArtworkFilterOptions, any>(
      {},
      query
    )

    if (opts.hashtags) {
      for (let i = 0; i < opts.hashtags.length; i++) {
        opts.hashtags[i] = opts.hashtags[i].toLowerCase()
      }
    }

    return opts
  }
}
