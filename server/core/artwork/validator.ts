import {
  validate,
  ValidationError as ClassValidatorError
} from 'class-validator'

import ValidationError from '../api/errors/validationError'
import UnknownError from '../api/errors/unknownError'
import { ArtworkDocument } from './'

export default async (artwork: ArtworkDocument): Promise<void> => {
  const internalProps = ['id', 'created', 'updated', 'owner', 'likes']

  if (!artwork.likes) {
    artwork.likes = []
  }

  const validationErrors: ClassValidatorError[] = await validate(
    artwork,
    {
      dismissDefaultMessages: true,
      validationError: { target: false }
    }
  )

  if (validationErrors.length > 0) {
    const messages: string[] = []

    const allowedErrors = validationErrors.filter((validationError) => {
      return !internalProps.includes(validationError.property)
    })
    allowedErrors.forEach((validationError) => {
      if (validationError.constraints) {
        Object.entries(validationError.constraints).forEach((entry) => {
          if (entry[1]) {
            messages.push(entry[1])
          }
        })
      }
    })

    // const internalErrors = validationErrors.filter((validationError) => {
    //   return internalProps.includes(validationError.property)
    // })
    // internalErrors.forEach((validationError) => {
    //   console.error('INTERNAL VALIDATION ERROR', validationError)
    // })

    if (messages.length > 0) {
      throw new ValidationError(messages)
    }

    throw new UnknownError('Validation Error')
  }
}
