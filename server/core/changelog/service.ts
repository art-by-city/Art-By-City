import { injectable } from 'inversify'
import fs from 'fs'

import { Changelog, ChangelogService } from './'
import { ChangelogParser } from './parser'

@injectable()
export default class ChangelogServiceImpl implements ChangelogService {
  private changelog!: Changelog
  private publicChangelog!: Changelog

  async getChangelog(isAdmin?: boolean): Promise<Changelog> {
    if (!this.changelog || !this.publicChangelog) {
      await this.buildChangelog()
    }

    return isAdmin ? this.changelog : this.publicChangelog
  }

  async buildChangelog() {
    const changelogFile = await fs.promises.readFile('CHANGELOG.md', 'utf8')
    this.changelog = new ChangelogParser().parse(changelogFile)
    this.publicChangelog = this.filterChangelogForPublic(this.changelog)
  }

  private filterChangelogForPublic(changelog: Changelog) {
    return {
      entries: changelog.entries.map((entry) => {
        return {
          version: entry.version,
          changes: entry.changes.filter((change) => {
            return !change.role
          })
        }
      })
    }
  }
}
