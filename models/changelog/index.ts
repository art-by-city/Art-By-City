export type ChangelogChange = {
  type: 'feature' | 'bugfix'
  role?: 'admin'
  content: string
}

export type ChangelogEntry = {
  version: string
  changes: ChangelogChange[]
}

export type Changelog = {
  entries: ChangelogEntry[]
}
