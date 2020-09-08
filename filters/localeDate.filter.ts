export default (value: string) => {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleString()
}