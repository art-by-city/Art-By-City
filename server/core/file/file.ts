import { Collection } from 'fireorm'

import Entity from '../common/entity'

@Collection('Files')
export default class File extends Entity {
  name!: string
  location!: string

  get fullPath() {
    return `${this.location}/${name}`
  }
}
