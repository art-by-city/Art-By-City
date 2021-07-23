import ApiServiceResult from './apiServiceResult.interface'
import ViewModel from '../viewModel'

type ViewModelOrVoid = ViewModel | void

export default class ApiServiceFailureResult<T extends ViewModelOrVoid>
  implements ApiServiceResult<ViewModelOrVoid> {
  success = false
  errors: Error[] = []
  payload?: T | null | undefined

  constructor(payload?: T) {
    this.payload = payload
  }
}
