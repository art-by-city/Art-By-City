import { Avatar, Profile } from '~/types'

export default interface User {
  address: string
  username?: string | null
  // id: string
  // username: string
  // name: string
  avatar?: Avatar | null
  profile?: Profile | null
  // roles: string[]
  // city: string
  // email: string
}
