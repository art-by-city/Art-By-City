import { Avatar } from '../avatar'
import { Profile } from '../profile'

export default interface User {
  address: string
  username?: string | null
  avatar?: Avatar | null
  profile?: Profile | null
}
