export default interface ApiServiceError extends Error {
  statusCode: number
}

export const isApiServiceError = function(
  error: Error
): error is ApiServiceError {
  return (error as ApiServiceError).statusCode !== undefined
}
