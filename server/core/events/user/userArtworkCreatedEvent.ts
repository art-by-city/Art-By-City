import { UserEvent, UserEvents } from './'

export default class UserArtworkCreatedEvent extends UserEvent {
  artworkId!: string

  constructor(userId: string, artworkId: string) {
    super()
    this.userId = userId
    this.type = UserEvents.Artwork.Created
    this.artworkId = artworkId
  }
}
