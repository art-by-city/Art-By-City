import { Collection } from 'fireorm'

@Collection()
export default class User {
  id!: string

  username!: string

  password?: string

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

  // toJSON(): DomainEntity {
  //   const clean = Object.assign(this, {})

  //   delete clean.password

  //   return (() => {
  //     return super.toJSON()
  //   }).call(clean)
  // }
}
