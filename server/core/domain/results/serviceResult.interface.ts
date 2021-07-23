export default interface ServiceResult<T> {
  success: boolean
  messages?: string[]
  payload?: T | null | undefined
  errors?: Error[]
}
