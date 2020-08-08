import { UserEvent, UserEvents } from '.'

export default class UserArtworkDeletedEvent extends UserEvent {
  artworkId!: string

  constructor(userId: string, artworkId: string) {
    super()
    this.userId = userId
    this.type = UserEvents.Artwork.Deleted
    this.artworkId = artworkId
  }
}
