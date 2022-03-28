import { Tip } from '../tips'

export type Like = boolean

export type LikeWithTip = Tip & {
  entityTxId: string
}
