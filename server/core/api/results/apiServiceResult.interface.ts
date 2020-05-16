export default interface ApiServiceResult<T> {
  success: boolean
  messages?: string[]
  payload?: T | null
}
