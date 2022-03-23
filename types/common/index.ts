export interface TrackableEntity {
  guid: string
}

export interface Avatar {
  id?: string
  src: string
  type: string
  version: 1 | 2
}

export interface Profile {
  displayName?: string
  bio?: string,
  twitter?: string
  instagram?: string
  twitch?: string
}

export type Username = string
export type Like = boolean
export type Tip = {
  amount: string
  from: string
}

export type DomainEntity =
  | Avatar
  | Profile
  | Username
  | Like

export type DomainEntityCategory =
  | 'artwork'
  | 'artwork:bundle'
  | 'avatar'
  | 'like'
  | 'profile'
  | 'tip'
  | 'username'
