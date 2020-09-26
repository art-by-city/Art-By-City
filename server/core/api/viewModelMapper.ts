import DomainEntity from '../common/entity'
import ViewModel from './viewModel'

export default interface ViewModelMapper<
  DE extends DomainEntity,
  VM extends ViewModel
> {
  toViewModel(domainEntity: DE): VM
}
