import ApiServiceResult from './apiServiceResult.interface'
import ViewModel from '../viewModel'

type ViewModelOrVoid = ViewModel | void

export default class ApiServiceSuccessResult<T extends ViewModelOrVoid> implements ApiServiceResult<ViewModelOrVoid> {
  success = true
  payload?: T | null | undefined

  constructor(payload?: T) {
    this.payload = payload
  }
}
