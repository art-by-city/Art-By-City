import { ValidationRule, mapRules } from './validationRule.interface'

const MIN_USERNAME_LENGTH = 3
const MIN_PASSWORD_LENGTH = 8

const _usernameRules: ValidationRule[] = [
  {
    validate: (v: string) => v.length >= MIN_USERNAME_LENGTH,
    message: 'Usernames must be at least 3 characters long'
  }
]

const _passwordRules: ValidationRule[] = [
  {
    validate: (v: string) => v.length >= MIN_PASSWORD_LENGTH,
    message: 'Passwords must be at least 8 characters long'
  },
  {
    validate: (v: string) => /[a-z]/.test(v),
    message: 'Passwords must contain at least 1 lowercase character'
  },
  {
    validate: (v: string) => /[A-Z]/.test(v),
    message: 'Passwords must contain at least 1 uppercase character'
  },
  {
    validate: (v: string) => /[0-9]/.test(v),
    message: 'Passwords must contain at least 1 number'
  },
  {
    validate: (v: string) => /[\s!"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]/.test(v),
    message: 'Passwords must contain at least 1 symbol'
  }
]

export const usernameRules = () => {
  return _usernameRules.map(mapRules)
}

export const passwordRules = () => {
  return _passwordRules.map(mapRules)
}

export default class AccountValidator {
  validate(username: string, password: string): string[] | null {
    let messages: string[] = []

    const usernameMessages = this.validateUsername(username)

    if (usernameMessages) {
      messages = messages.concat(usernameMessages)
    }

    const passwordMessages = this.validatePassword(password)

    if (passwordMessages) {
      messages = messages.concat(passwordMessages)
    }

    return messages.length > 0 ? messages : null
  }

  validateUsername(username: string): string[] | null {
    const messages: string[] = []

    for (let i = 0; i < _usernameRules.length; i++) {
      if (!_usernameRules[i].validate(username)) {
        messages.push(_usernameRules[i].message)
      }
    }

    return messages.length > 0 ? messages : null
  }

  validatePassword(password: string): string[] | null {
    const messages: string[] = []

    for (let i = 0; i < _passwordRules.length; i++) {
      if (!_passwordRules[i].validate(password)) {
        messages.push(_passwordRules[i].message)
      }
    }

    return messages.length > 0 ? messages : null
  }
}
