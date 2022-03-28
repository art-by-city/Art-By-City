export default (value: string | number) => {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleString()
}