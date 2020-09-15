import { Collection } from 'fireorm'

import Entity from '../common/entity'
import { FileAssetType } from './'

@Collection('Files')
export default class File extends Entity {
  name!: string
  location!: string
  type!: string
  owner!: string
  assetType!: FileAssetType

  get fullPath() {
    return `${this.location}/${name}`
  }
}
