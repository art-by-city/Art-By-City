export default class Entity {
  id!: string
  created!: Date
  updated!: Date

  constructor(data?: {
    id?: string,
    created?: Date,
    updated?: Date
  }) {
    this.id = data?.id || ''
    this.created = data?.created || new Date()
    this.updated = data?.updated || new Date()
  }
}
