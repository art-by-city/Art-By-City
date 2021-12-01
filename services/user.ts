import { Context } from '@nuxt/types'

import { ArDBService, AvatarService } from './'

export default class UserService extends ArDBService {
  $avatarService!: AvatarService

  constructor(context: Context) {
    super(context)
    this.$avatarService = context.$avatarService
  }

  async fetchUser(address: string) {
    const avatar = await this.$avatarService.fetchAvatar(address)

    return {
      address,
      avatar
    }
  }
}
