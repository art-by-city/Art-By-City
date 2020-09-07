import { Collection } from 'fireorm'

import Entity from '../common/entity'

@Collection('Invitations')
export default class Invitation extends Entity {
  createdByUser!: string
  sent?: boolean
  sentOn?: Date
  used?: boolean
  usedOn?: Date
  usedByUser?: string
}