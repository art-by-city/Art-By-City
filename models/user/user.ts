export interface UserAvatar {
  source: string
}

export default interface User {
  address: string
  // id: string
  // username: string
  // name: string
  // avatar: UserAvatar
  // roles: string[]
  // city: string
  // email: string
  // changelogLastVersionViewed?: string
}

export function getUser(authUser: Record<string, unknown> | null): User | null {
  if (authUser) {
    return {
      address: authUser.address as string
      // id: authUser.id as string,
      // name: authUser.name as string,
      // username: authUser.username as string,
      // avatar: authUser.avatar as UserAvatar,
      // roles: authUser.roles as string[],
      // city: authUser.city as string,
      // email: authUser.email as string,
      // changelogLastVersionViewed: authUser.changelogLastVersionViewed
      //   ? authUser.changelogLastVersionViewed as string
      //   : undefined
    }
  }

  return null
}
