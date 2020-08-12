import ViewModel from '../../api/viewModel'
import { CityViewModel } from '../../city'

export default interface ConfigViewModel extends ViewModel {
  cities: CityViewModel[]
  hashtags: string[]
  maxUserArtworks: number
}
