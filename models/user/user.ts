import { Avatar, Profile } from '~/types'

export default interface User {
  address: string
  username?: string | null
  avatar?: Avatar | null
  profile?: Profile | null
}
