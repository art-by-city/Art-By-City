import Artwork, { artworkTypes, regions } from '../artwork/artwork.interface'
import { ValidationRule, mapRules } from './validationRule.interface'

/**
 * Artwork - Title
 */
const MIN_TITLE_LENGTH = 1
const MAX_TITLE_LENGTH = 124
const _titleRules: ValidationRule[] = [
  {
    validate: (v: string) => v.length >= MIN_TITLE_LENGTH,
    message: 'Artwork Titles must be at least 1 character'
  },
  {
    validate: (v: string) => v.length <= MAX_TITLE_LENGTH,
    message: `Artwork Titles must be less than ${MAX_TITLE_LENGTH} characters`
  }
]
export const titleRules = () => {
  return _titleRules.map(mapRules)
}

/**
 * Artwork - Description
 */
const MAX_DESCRIPTION_LENGTH = 1024
const _descriptionRules: ValidationRule[] = [
  {
    validate: (v: string) => v.length <= MAX_DESCRIPTION_LENGTH,
    message: `Descriptions must be less than ${MAX_DESCRIPTION_LENGTH} characters`
  }
]
export const descriptionRules = () => {
  return _descriptionRules.map(mapRules)
}

/**
 * Artwork - Type
 */
const _typeRules: ValidationRule[] = [
  {
    validate: (v: string) => artworkTypes.includes(v),
    message: `Artwork Type must be one of [${artworkTypes.join(', ')}]`
  }
]
export const typeRules = () => {
  return _typeRules.map(mapRules)
}

/**
 * Artwork - Region
 */
const _regionRules: ValidationRule[] = [
  {
    validate: (v: string) => regions.includes(v),
    message: `Region must be one of [${regions.join(', ')}]`
  }
]
export const regionRules = () => {
  return _regionRules.map(mapRules)
}

/**
 * Artwork - Hashtags
 */
const MAX_HASHTAG_LENGTH = 124
const _hashtagRules: ValidationRule[] = [
  {
    validate: (v: string) => v.length <= MAX_HASHTAG_LENGTH,
    message: `Hashtags must be less than ${MAX_HASHTAG_LENGTH} characters`
  }
]
export const hashtagRules = () => {
  return _hashtagRules.map(mapRules)
}

export default class ArtworkValidator {
  validiate(artwork: Artwork): string[] | null {
    const messages: string[] = []

    _titleRules.forEach((rule) => {
      if (!rule.validate(artwork.title)) {
        messages.push(rule.message)
      }
    })

    _descriptionRules.forEach((rule) => {
      if (!rule.validate(artwork.description)) {
        messages.push(rule.message)
      }
    })

    _typeRules.forEach((rule) => {
      if (!rule.validate(artwork.type)) {
        messages.push(rule.message)
      }
    })

    _regionRules.forEach((rule) => {
      if (!rule.validate(artwork.region)) {
        messages.push(rule.message)
      }
    })

    _hashtagRules.forEach((rule) => {
      const hashtags = artwork.hashtags || []
      hashtags.forEach((hashtag) => {
        if (!rule.validate(hashtag)) {
          messages.push(rule.message)
        }
      })
    })

    return messages.length > 0 ? messages : null
  }
}
