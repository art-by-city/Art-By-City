import DomainEntity from '../common/entity'
import ViewModel from './viewModel'

export default interface EntityMapper<DE extends DomainEntity, VM extends ViewModel> {
  toViewModel(domainEntity: DE): VM | null
}
