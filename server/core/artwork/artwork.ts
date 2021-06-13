import { Collection } from 'fireorm'

import Entity from '../common/entity'
import { ArtworkImage } from './'
import {
  IsString,
  MaxLength,
  ArrayUnique,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsNotEmpty,
  MinLength
} from 'class-validator'

@Collection()
export default class Artwork extends Entity {
  @IsNotEmpty({ message: 'Artwork Owner is required' })
  owner!: string

  @IsString()
  @MinLength(1, {
    message: 'title must be at least 1 character'
  })
  @MaxLength(128, {
    message: 'title must be less than $constraint1 characters'
  })
  title!: string

  @IsString()
  @MaxLength(1024, {
    message: 'description must be less than $constraint1 characters'
  })
  description?: string

  @IsString()
  @IsNotEmpty()
  type!: string

  @IsString()
  @IsNotEmpty({
    message: 'city is required'
  })
  city!: string

  @ArrayUnique({
    message: 'hashtags must be unique'
  })
  @ArrayMaxSize(12, {
    message: 'hashtags must be no more than 12'
  })
  @MinLength(1, {
    each: true,
    message: 'hashtags must be at least 1 character'
  })
  @MaxLength(32, {
    each: true,
    message: 'hashtags must be no more than $constraint1 characters'
  })
  hashtags!: string[]

  @ArrayMinSize(1, {
    message: 'image is required'
  })
  @ArrayMaxSize(12, {
    message: 'images must be no more than 12'
  })
  @ValidateNested({ each: true })
  images!: ArtworkImage[]

  @ArrayUnique()
  @IsString({ each: true })
  likes!: string[]

  published!: boolean
  approved!: boolean

  setProps(data: {
    userId: string,
    title: string,
    description: string,
    type: string,
    cityId: string,
    hashtags: string[],
    images: ArtworkImage[]
  }): Artwork {
    this.id = ''
    this.created = new Date()
    this.updated = new Date()
    this.owner = data.userId
    this.title = data.title
    this.description = data.description
    this.type = data.type
    this.city = data.cityId
    this.images = data.images
    this.likes = []
    this.published = false
    this.approved = false

    return this.setHashtags(data.hashtags)
  }

  setHashtags(hashtags: string[]) {
    this.hashtags = []
    for (let i = 0; i < hashtags.length; i++) {
      this.hashtags.push(hashtags[i].toLowerCase())
    }

    return this
  }

  update(data: {
    title?: string,
    description?: string,
    type?: string,
    cityId?: string,
    hashtags?: string[],
    images?: ArtworkImage[]
  }): Artwork {
    if (data.title) {
      this.title = data.title
    }

    if (data.description) {
      this.description = data.description
    }

    if (data.type) {
      this.type = data.type
    }

    if (data.cityId) {
      this.city = data.cityId
    }

    if (data.hashtags) {
      this.hashtags = data.hashtags
    }

    if (data.images) {
      this.images = data.images
    }

    return this
  }
}
