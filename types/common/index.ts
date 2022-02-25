export interface TrackableEntity {
  guid: string
}

export interface Avatar {
  id?: string
  src: string
}

export interface Profile {
  displayName?: string
  bio?: string,
  twitter?: string
}

export type Username = string
export type Like = boolean

export type DomainEntity =
  | Avatar
  | Profile
  | Username
  | Like

export type DomainEntityCategory =
  | 'artwork'
  | 'avatar'
  | 'like'
  | 'profile'
  | 'username'
