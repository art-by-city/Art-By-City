export function maxLength(limit: number) {
  return (value: string = '') => {
    return value.length > limit
      ? `Maximum ${limit} characters`
      : true
  }
}

type SocialHandleRegexTextInput = {
  regex: RegExp,
  message: string
}

function removePrecedingAtSymbol(value: string): string {
  return value[0] === '@' ? value.substring(1) : value
}

function socialHandleRegexTest(testConfig: SocialHandleRegexTextInput): Function {
  return (username: string = '', required = false) => {
    if (!required && !username) {
      return true
    }

    return testConfig.regex.test(removePrecedingAtSymbol(username))
      ? true
      : testConfig.message
  }
}

export const socialHandles: {
  [socialNetwork: string]: SocialHandleRegexTextInput
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
    regex: /^[a-z0-9_\-]{3,25}$/,
    message: 'Must be a valid SoundCloud username'
  },
  linkedin: {
    regex: /^[a-z0-9]{3,100}$/,
    message: 'Must be a valid LinkedIn username'
  }
}

const twitter = socialHandleRegexTest(socialHandles.twitter)
const twitch = socialHandleRegexTest(socialHandles.twitch)
const instagram = socialHandleRegexTest(socialHandles.instagram)
const soundcloud = socialHandleRegexTest(socialHandles.soundcloud)
const linkedin = socialHandleRegexTest(socialHandles.linkedin)

export {
  twitter,
  twitch,
  instagram,
  soundcloud,
  linkedin
}
