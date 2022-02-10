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

export type DomainEntityCategory = 'artwork' | 'avatar' | 'like' | 'profile'
