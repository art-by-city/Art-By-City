import { Collection } from 'fireorm'

import Entity from '../common/entity'
import { ArtworkType } from '../artwork'

@Collection('Config')
export default class Config extends Entity {
 maxUserArtworks!: number
 artworkTypes!: ArtworkType[]
}
