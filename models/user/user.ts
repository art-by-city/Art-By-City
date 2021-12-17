import { Avatar } from '~/types'

export default interface User {
  address: string
  // id: string
  // username: string
  // name: string
  avatar?: Avatar | null
  // roles: string[]
  // city: string
  // email: string
  // changelogLastVersionViewed?: string
}
