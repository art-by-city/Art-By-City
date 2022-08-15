export function maxLength(limit: number) {
  return (value: string = '') => {
    return value.length > limit
      ? `Maximum ${limit} characters`
      : true
  }
}

function removePrecedingAtSymbol(value: string): string {
  return value[0] === '@' ? value.substring(1) : value
}

function socialHandleRegexTest(expression: RegExp, message: string): Function {
  return (username: string = '', required = false) => {
    if (!required && !username) {
      return true
    }

    return expression.test(removePrecedingAtSymbol(username))
      ? true
      : message
  }
}

export const socialHandles: {
  [socialNetwork: string]: {
    regex: RegExp,
    message: string
  }
} = {
  twitter: {
    regex: /^[A-Za-z0-9_]{1,15}$/,
    message: 'Must be a valid Twitter username'
  },
  twitch: {
    regex: /^[A-Za-z0-9_]{2,25}$/,
    message: 'Must be a valid Twitch username'
  },
  instagram: {
    regex: /^[A-Za-z0-9_\.]{1,30}$/,
    message: 'Must be a valid Instagram username'
  },
  soundcloud: {
    regex: /^[a-z0-9_\-]{3,25}$/, // TODO, max length?
    message: 'Must be a valid SoundCloud username'
  }
}

const twitter = socialHandleRegexTest(
  socialHandles.twitter.regex,
  socialHandles.twitter.message
)

const twitch = socialHandleRegexTest(
  socialHandles.twitch.regex,
  socialHandles.twitch.message
)

const instagram = socialHandleRegexTest(
  socialHandles.instagram.regex,
  socialHandles.instagram.message
)

const soundcloud = socialHandleRegexTest(
  socialHandles.soundcloud.regex,
  socialHandles.soundcloud.message
)

export {
  twitter,
  twitch,
  instagram,
  soundcloud
}
