export interface UserAvatar {
  source: string
}

export default interface User {
  id: string
  username: string
  avatar: UserAvatar
}
