export const usernameRules = [
  (value: string = '') => {
    if (value.length < 3) {
      return 'Usernames must be at least 3 characters'
    }

    return true
  }
]

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
export const emailRules = [
  (value: string = '') => {
    if (!emailRegex.test(value)) {
      return 'A valid email address is required'
    }

    return true
  }
]

export const passwordRules = [
  (value: string = '') => {
    if (value.length < 8) {
      return 'Passwords must be at least 8 characters'
    }

    return true
  },
  (value: string = '') => {
    if (!/[a-z]/.test(value)) {
      return 'Passwords must contain at least 1 lowercase character'
    }

    return true
  },
  (value: string = '') => {
    if (!/[A-Z]/.test(value)) {
      return 'Passwords must contain at least 1 uppercase character'
    }

    return true
  },
  (value: string = '') => {
    if (!/[0-9]/.test(value)) {
      return 'Passwords must contain at least 1 number'
    }

    return true
  },
  // (value: string = '') => {
  //   if (!/[\s!"#$%&'()*+,-./\\:;<=>?@[\]^_`{|}~]/.test(value)) {
  //     return 'Passwords must contain at least 1 symbol'
  //   }

  //   return true
  // }
]

export const repeatPasswordRules = (repeatPassword: string) => {
  return [
    (v: string) => (v || '') === repeatPassword || 'Passwords must match'
  ]
}
