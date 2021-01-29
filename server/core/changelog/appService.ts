import { injectable, inject } from 'inversify'
import { UserService } from '../user'
import {
  ChangelogService,
  ChangelogApplicationService,
  ChangelogViewModel
} from './'

@injectable()
export default class ChangelogApplicationServiceImpl
  implements ChangelogApplicationService {
  private userService: UserService
  private changelogService: ChangelogService

  constructor(
    @inject(Symbol.for('ChangelogService'))
    changelogService: ChangelogService,
    @inject(Symbol.for('UserService'))
    userService: UserService
  ) {
    this.changelogService = changelogService
    this.userService = userService
  }

  async markVersionSeenForUser(userId: string, version: string): Promise<true> {
    try {
      const user = await this.userService.getById(userId)
      if (user) {
        user.changelogLastVersionSeen = version
        await this.userService.saveUser(user)
      }
    } catch (error) {
      console.error(error)
    }

    return true
  }

  async getChangelogForUser(userId: string): Promise<ChangelogViewModel> {
    const user = await this.userService.getById(userId)
    const isAdmin = user?.hasRole('admin') || false
    const changelog = await this.changelogService.getChangelog(isAdmin)

    return changelog
  }
}
