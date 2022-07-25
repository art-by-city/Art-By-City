import { Context } from '@nuxt/types'

import { ArDBService, AvatarService } from '.'
import { UsernameService } from './username'

const admins = [
  'Uy2XZ7P7F4zBllF5uPdd1ih9jiQrIGvD3X8L13cc5_s',
  '36Ar8VmyC7YS7JGaep9ca2ANjLABETTpxSeA7WOV45Y',
  'x3GW6wfBZ3wHTflETInuzJ5rOv_6JvlFi-dl6yYAr8Y'
]

export default class UserService extends ArDBService {
  $avatarService!: AvatarService
  $usernameService!: UsernameService

  constructor(context: Context) {
    super(context)

    this.$avatarService = context.$avatarService
    this.$usernameService = context.$usernameService
  }

  async fetchUser(address: string) {
    const username = await this.$usernameService.resolveUsername(address)
    const roles = []

    if (admins.includes(address)) {
      roles.push('admin')
    }

    return { address, username, roles }
  }
}
