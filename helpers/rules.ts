export function maxLength(limit: number) {
  return (value: string = '') => {
    return value.length > limit
      ? `Maximum ${limit} characters`
      : true
  }
}
