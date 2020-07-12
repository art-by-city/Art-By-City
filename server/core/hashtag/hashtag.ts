import { Collection } from 'fireorm'

import Entity from '../common/entity'

@Collection('Hashtags')
export default class Hashtag extends Entity {
  hashtag!: string
}