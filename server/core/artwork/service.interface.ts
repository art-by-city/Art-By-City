import User from '../user/user'
import Artwork from './artwork'
import { ArtworkImage } from './artwork.interface'

export default interface ArtworkService {
  create(
    user: User,
    artwork: Artwork,
    images?: ArtworkImage[]
  ): Promise<Artwork | null>
  list(): Promise<Artwork[]>
  listForUser(user: User): Promise<Artwork[]>
  get(id: string): Promise<Artwork | null>
  delete(id: string): Promise<void>
}
