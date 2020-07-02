import { Collection } from 'fireorm'

@Collection('Cities')
export default class City {
  id!: string
  code!: string
  name!: string
  country!: string
}
