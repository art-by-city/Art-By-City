export interface UserAvatar {
  source: string
}

export default interface User {
  id: string
  username: string
  name: string
  avatar: UserAvatar
  roles: string[]
  city: string
  email: string
}

export function getUser(authUser: Record<string, unknown> | null): User | null {
  if (authUser) {
    return {
      id: authUser.id as string,
      username: authUser.username as string,
      avatar: authUser.avatar as UserAvatar,
      roles: authUser.roles as string[],
      city: authUser.city as string,
      email: authUser.email as string
    }
  }

  return null
}
