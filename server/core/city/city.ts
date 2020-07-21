import { Collection } from 'fireorm'

import Entity from '../common/entity'

@Collection('Cities')
export default class City extends Entity {
  code!: string
  name!: string
  country!: string
}
