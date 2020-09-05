import { Collection } from 'fireorm'

import Entity from '../common/entity'

@Collection('Invitations')
export default class InvidationCode extends Entity {
  createdByUser!: string
  sent!: boolean
  sentOn!: Date
}