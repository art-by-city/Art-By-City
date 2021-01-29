import MarkdownIt from 'markdown-it'
import Token from 'markdown-it/lib/token'

import { Changelog, ChangelogChange, ChangelogEntry } from '..'

export class ChangelogParser {
  parse(data: string): Changelog {
    const changelog = { entries: [] as ChangelogEntry[] }
    const parsed = new MarkdownIt().parse(data, {})
    for (let i = 0; i < parsed.length; i++) {
      const token = parsed[i]
      if (token.markup === '##' && token.type === 'heading_open' && parsed[i+1]) {
        const version = this.parseChangelogVersionEntry(parsed[i+1])
        if (version) {
          changelog.entries.push({ version, changes: [] })
        }
      }

      if (token.markup === '###' && token.type === 'heading_open' && parsed[i+1]) {
        changelog.entries[changelog.entries.length-1].changes.push(
          ...this.parseChangelogChangeset(parsed[i+1], parsed.slice(i+2))
        )
      }
    }

    return changelog
  }

  private parseChangelogVersionEntry(token: Token) {
    return token.children?.reduce<string>((version: string, child: Token) => {
      return child.type === 'text' ? child.content : version
    }, '')
  }

  private parseChangelogChangeset(titleToken: Token, remaining: Token[]) {
    const { type, role } = this.parseChangesetTitle(titleToken.content)
    const changes: ChangelogChange[] = []
    let isInListItem = false
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].markup === '###' && remaining[i].type === 'heading_open') {
        break
      } else if (!isInListItem && remaining[i].type === 'list_item_open') {
        isInListItem = true
      } else if (isInListItem && remaining[i].type === 'list_item_close') {
        isInListItem = false
      } else if (isInListItem && remaining[i].type === 'inline') {
        changes.push({ type, role, content: remaining[i].content })
      }
    }

    return changes
  }

  private parseChangesetTitle(title: string): { type: 'feature' | 'bugfix', role?: 'admin' } {
    return {
      type: title.toLowerCase().includes('features') ? 'feature' : 'bugfix',
      role: title.toLowerCase().includes('admin') ? 'admin' : undefined
    }
  }
}
