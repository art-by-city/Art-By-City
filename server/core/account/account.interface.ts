export default interface Account {
  id: string
  username: string
  password?: string
  roles: string[]
  updatePassword(newPassword: string): void
  verifyPassword(otherPassword: string): boolean
  addRole(role: string): void
  setRoles(roles: string[]): void
}
