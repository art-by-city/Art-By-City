import { Context } from '@nuxt/types'

import { ArDBService, AvatarService } from './'
import { UsernameService } from './username'

export default class UserService extends ArDBService {
  $avatarService!: AvatarService
  $usernameService!: UsernameService

  constructor(context: Context) {
    super(context)

    this.$avatarService = context.$avatarService
    this.$usernameService = context.$usernameService
  }

  async fetchUser(address: string) {
    const avatar = await this.$avatarService.fetchAvatar(address)
    const username = await this.$usernameService.resolveUsername(address)

    return {
      address,
      avatar,
      username
    }
  }
}
