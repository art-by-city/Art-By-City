const MIN_USERNAME_LENGTH = 3
const MIN_PASSWORD_LENGTH = 8

interface ValidationRule {
  validate: (v: string) => boolean
  message: string
}

const _usernameRules: ValidationRule[] = [
  {
    validate: (v: string) => v.length >= MIN_USERNAME_LENGTH,
    message: 'Usernames must be at least 3 characters long'
  }
]

const usernameRules = () => {
  return _usernameRules.map((rule) => (v: string) =>
    rule.validate(v || '') || rule.message
  )
}

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

const passwordRules = () => {
  return _passwordRules.map((rule) => (v: string) =>
    rule.validate(v || '') || rule.message
  )
}

const validateUsername = (username: string): string[] => {
  const messages: string[] = []

  for (let i = 0; i < _usernameRules.length; i++) {
    if (!_usernameRules[i].validate(username)) {
      messages.push(_usernameRules[i].message)
    }
  }

  return messages
}

const validatePassword = (password: string): string[] => {
  const messages: string[] = []

  for (let i = 0; i < _passwordRules.length; i++) {
    if (!_passwordRules[i].validate(password)) {
      messages.push(_passwordRules[i].message)
    }
  }

  return messages
}

export { usernameRules, passwordRules, validateUsername, validatePassword }
