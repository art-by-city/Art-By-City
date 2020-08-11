import { Collection } from 'fireorm'

import Entity from '../common/entity'

@Collection('Config')
export default class Config extends Entity {
 maxUserArtworks!: number
}
