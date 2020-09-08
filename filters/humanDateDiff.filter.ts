import moment from 'moment'

export default (value: string) => {
  if (!value) {
    return ''
  }

  return moment(value).fromNow()
}
