export type ArtworkHashtagAdded = 'artwork:hashtag:added'
export type ArtworkEventType =
  | ArtworkHashtagAdded

export const ArtworkEvents = {
  Hashtag: {
    Added: 'artwork:hashtag:added'
  } as {
    Added: ArtworkHashtagAdded
  }
}
