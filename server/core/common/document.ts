import { IsDate, IsString } from 'class-validator'

export default class Document {
  @IsString()
  id!: string

  @IsDate()
  created!: Date

  @IsDate()
  updated!: Date
}
