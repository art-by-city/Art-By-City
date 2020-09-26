import ViewModelMapper from '../api/viewModelMapper'
import { City, CityViewModel } from './'

export default class CityMapper implements ViewModelMapper<City, CityViewModel> {
  toViewModel(domainEntity: City): CityViewModel {
    return {
      id: domainEntity.id,
      code: domainEntity.code,
      name: domainEntity.name,
      country: domainEntity.country,
      visible: domainEntity.visible,
      disabled: domainEntity.disabled
    }
  }
}
