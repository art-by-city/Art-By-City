import moment from 'moment'

export default (value: string | number) => {
  if (!value) {
    return ''
  }

  const date = moment(value)

  if (!date.isValid()) {
    return ''
  }

  return moment(value).fromNow()
}
