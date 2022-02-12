export function maxLength(limit: number) {
  return (value: string = '') => {
    return value.length > limit
      ? `Maximum ${limit} characters`
      : true
  }
}

export function twitter(username: string = '', required = false) {
  if (!required && !username) {
    return true
  }

  const sanitizedUsername = username[0] === '@'
    ? username.substring(1)
    : username

  return /^[A-Za-z0-9_]{1,15}$/.test(sanitizedUsername)
    ? true
    : 'Must be a valid Twitter username'
}
