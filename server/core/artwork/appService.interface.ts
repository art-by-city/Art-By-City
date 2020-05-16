import ApplicationService from '../applicationService.interface'
import ApiServiceResult from '../api/results/apiServiceResult.interface'
import Artwork from './artwork'

export default interface ArtworkService extends ApplicationService {
  create(
    props: any,
    files?: Express.Multer.File[]
  ): Promise<ApiServiceResult<void>>

  list(): Promise<ApiServiceResult<Artwork[]>>
}
