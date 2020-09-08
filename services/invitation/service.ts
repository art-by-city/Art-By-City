import { Context } from '@nuxt/types'

import ProgressService from '~/services/progress/service'
import ToastService from '~/services/toast/service'
import Invitation from '~/models/invitation'

export default class InvitationService {
  _context!: Context

  constructor(context: Context) {
    this._context = context
  }

  async requestNewInvitation(): Promise<Invitation | undefined> {
    ProgressService.start()
    try {
      const { payload } = await this._context.$axios.$post('/api/invitations')

      if (payload) {
        return payload
      }
    } catch (error) {
      ToastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }

  async fetchInvitations(): Promise<Invitation[] | undefined> {
    ProgressService.start()
    try {
      const { payload } = await this._context.$axios.$get('/api/invitations')

      if (payload) {
        return payload
      }
    } catch (error) {
      ToastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }
}
