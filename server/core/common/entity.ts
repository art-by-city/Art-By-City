import { IsDate, IsString } from 'class-validator'

export default class Entity {
  @IsString()
  id!: string

  @IsDate()
  created!: Date

  @IsDate()
  updated!: Date
}
