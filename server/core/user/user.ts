import { Entity, rootCollection, field } from 'firebase-firestorm'

@rootCollection({ name: 'users' })
export default class User extends Entity {
  @field({ name: 'name' })
  name!: string

  @field({ name: 'roles' })
  roles!: string[]
}
