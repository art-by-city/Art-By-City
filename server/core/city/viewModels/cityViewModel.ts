import ViewModel from '../../api/viewModel'

export default interface CityViewModel extends ViewModel {
  id: string
  code: string
  name: string
  country: string
  visible: boolean
  disabled: boolean
}
