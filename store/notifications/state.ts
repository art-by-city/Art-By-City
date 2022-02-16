import { Notification } from '~/models'

export const DEFAULT_STATE = {
  notifications: [] as Notification[]
}

const state = () => ({ ...DEFAULT_STATE })

export type NotificationsStoreState = ReturnType<typeof state>

export default state
