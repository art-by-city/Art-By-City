export interface TrackableEntity {
  guid: string
}

export interface Avatar {
  id?: string
  src: string
}

export type DomainEntityCategory = 'artwork' | 'avatar' | 'like'
