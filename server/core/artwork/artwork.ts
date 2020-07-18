import { Collection } from 'fireorm'

import Entity from '../common/entity'
import { User } from '../user'
import { ArtworkType, ArtworkImage } from './'
import {
  IsString,
  MaxLength,
  IsIn,
  ArrayUnique,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsNotEmpty,
  MinLength
} from 'class-validator'

const artworkTypes = [
  'Painting',
  'Illustration',
  'Drawing',
  'Sculpture',
  'Photograph',
  'Mixed-Media',
  'Digital',
  'Other'
]

@Collection()
export default class Artwork extends Entity {
  @IsNotEmpty({ message: 'Artwork Owner is required' })
  owner!: string | User // TODO -> remove User type when refactoring to view entities

  @IsString()
  @MinLength(1, {
    message: 'Artwork Title must be at least 1 character'
  })
  @MaxLength(128, {
    message: 'Artwork Title must be less than $constraint1 characters'
  })
  title!: string

  @IsString()
  @MaxLength(1024, {
    message: 'Artwork Description must be less than $constraint1 characters'
  })
  description!: string

  @IsString()
  @IsNotEmpty()
  @IsIn(artworkTypes, {
    message: `Artwork Type must be one of ${artworkTypes.join(', ')}`
  })
  type!: ArtworkType

  @IsString()
  @IsNotEmpty({
    message: 'Artwork City is required'
  })
  city!: string

  @ArrayUnique({
    message: 'Artwork Hashtags must be unique'
  })
  @ArrayMaxSize(12, {
    message: 'Artwork Hashtags must be no more than 12'
  })
  @MinLength(1, {
    each: true,
    message: 'Artwork Hashtags must be at least 1 character'
  })
  @MaxLength(32, {
    each: true,
    message: 'Artwork Hashtags must be no more than $constraint1 characters'
  })
  hashtags!: string[]

  @ArrayMinSize(1, {
    message: 'Artwork Image is required'
  })
  @ArrayMaxSize(12, {
    message: 'Artwork Images must be no more than 12'
  })
  @ValidateNested({ each: true })
  images!: ArtworkImage[]

  @ArrayUnique()
  @IsString({ each: true })
  likes!: string[]
}
