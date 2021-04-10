import { Context } from '@nuxt/types'

const lastVersionSeenKey = 'changelogLastVersionSeen'

export default class ChangelogService {
  _context!: Context
  $store!: any

  constructor(context: Context) {
    this._context = context
    this.$store = context.store
  }

  markLatestChangelogSeen() {
    this._context.$auth.$storage.setUniversal(
      lastVersionSeenKey,
      this.$store.state.config.changelogLatestVersion
    )
    this._context.$auth.setUser({
      ...this._context.$auth.user,
      changelogLastVersionViewed: this.$store.state.config
        .changelogLatestVersion
    })
  }

  hasSeenLatestChangelog(): boolean {
    return (
      this.$store.state.config.changelogLatestVersion ===
      this._context.$auth.$storage.getUniversal(lastVersionSeenKey)
    )
  }
}
