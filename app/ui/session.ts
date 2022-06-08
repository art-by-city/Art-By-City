import { uuidv4 } from '~/app/util'

export interface Session {
  sid: string
}

export function createSession(): Session {
  return {
    sid: uuidv4()
  }
}
