import { Avatar } from '../avatar'
import { Like } from '../likes'
import { Profile } from '../profile'
import { Tip } from '../tips'

export interface TrackableEntity {
  guid: string
}

export type Username = string

export type DomainEntity =
  | Avatar
  | Profile
  | Username
  | Like
  | Tip

export type DomainEntityCategory =
  | 'artwork'
  | 'artwork:bundle'
  | 'avatar'
  | 'like'
  | 'profile'
  | 'tip'
  | 'username'
