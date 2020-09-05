import ViewModel from '../../api/viewModel'
import { CityViewModel } from '../../city'
import { ArtworkType } from '../../artwork'

export default interface ConfigViewModel extends ViewModel {
  cities: CityViewModel[]
  hashtags: string[]
  maxUserArtworks: number
  artworkTypes: ArtworkType[]
}
