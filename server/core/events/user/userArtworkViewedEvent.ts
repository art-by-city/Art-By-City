import { UserEvent, UserEvents } from './'

export default class UserArtworkViewedEvent extends UserEvent {
  artworkId!: string

  constructor(userId: string, artworkId: string) {
    super()
    this.userId = userId
    this.type = UserEvents.Artwork.Viewed
    this.artworkId = artworkId
  }
}
