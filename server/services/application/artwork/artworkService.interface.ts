import ApplicationService from '../../applicationService.interface'
import ApiServiceResult from '../../results/apiServiceResult.interface'
import Artwork from '../../../core/artwork/artwork'

export default interface ArtworkService extends ApplicationService {
  create(
    props: any,
    files?: Express.Multer.File[]
  ): Promise<ApiServiceResult<void>>

  list(): Promise<ApiServiceResult<Artwork[]>>
}
