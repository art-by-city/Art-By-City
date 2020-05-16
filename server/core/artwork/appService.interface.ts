import ApplicationService from '../applicationService.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import User from '../user/user'
import Artwork from './artwork'

export default interface ArtworkService extends ApplicationService {
  get(id: string): Promise<ApiServiceResult<Artwork>>
  delete(user: User, id: string): Promise<ApiServiceResult<void>>
  create(
    request: any,
    files?: Express.Multer.File[]
  ): Promise<ApiServiceResult<Artwork>>

  list(): Promise<ApiServiceResult<Artwork[]>>
  listForUser(user: User): Promise<ApiServiceResult<Artwork[]>>
}
