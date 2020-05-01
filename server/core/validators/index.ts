const required = () => {
  return [(v: string) => (v || '') !== '' || 'This field is required']
}

export { required }
