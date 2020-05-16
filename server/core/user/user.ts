import { rootCollection, field } from 'firebase-firestorm'
import DomainEntity from '../domainEntity'

@rootCollection({ name: 'users' })
export default class User extends DomainEntity {
  @field({ name: 'username' })
  username!: string

  @field({ name: 'password' })
  password?: string

  @field({ name: 'roles' })
  roles!: string[]

  updatePassword(newPassword: string): void {
    this.password = newPassword
  }

  verifyPassword(otherPassword: string): boolean {
    return this.password === otherPassword
  }

  addRole(role: string): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role)
    }
  }

  setRoles(roles: string[]): void {
    this.roles = roles
  }

  toJSON(): DomainEntity {
    const clean = Object.assign(this, {})

    delete clean.password

    return (() => {
      return super.toJSON()
    }).call(clean)
  }
}
