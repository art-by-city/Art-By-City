import { Collection } from 'fireorm'
import {
  MinLength,
  IsString,
  ArrayUnique,
  IsNotEmpty,
  IsEmail
} from 'class-validator'
import crypto from 'crypto'

import Entity from '../common/entity'

export interface UserAvatar {
  source: string
}

@Collection()
export default class User extends Entity {
  @IsString()
  @MinLength(3, {
    message: 'Username must be at least 3 characters'
  })
  username!: string

  @IsString()
  name: string = ''

  @IsEmail()
  email!: string

  @IsString()
  password?: string

  @IsString()
  salt?: string

  @ArrayUnique()
  @IsString({ each: true })
  roles!: string[]

  @IsString()
  @IsNotEmpty({
    message: 'City is required'
  })
  city!: string

  artworkCount!: number

  invitation?: string

  avatar?: UserAvatar

  private saltAndHash(password: string): string {
    if (!this.salt) {
      this.salt = crypto
        .randomBytes(Math.ceil(8))
        .toString('hex')
        .slice(0, 16)
    }

    const hash = crypto.createHmac('sha512', this.salt)
    hash.update(password)

    return hash.digest('hex')
  }

  setPassword(newPassword: string): void {
    this.password = this.saltAndHash(newPassword)
  }

  verifyPassword(otherPassword: string): boolean {
    return this.password === this.saltAndHash(otherPassword)
  }

  addRole(role: string): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role)
    }
  }

  setRoles(roles: string[]): void {
    this.roles = roles
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role)
  }

  toString() {
    return this.id
  }
}
