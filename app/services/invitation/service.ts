import { Context } from '@nuxt/types'

import ProgressService from '~/app/services/progress/service'
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
      this._context.$toastService.error(error)
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
      this._context.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }

  async sendInvitationEmail(invitation: Invitation): Promise<Invitation | undefined> {
    ProgressService.start()
    try {
      const { success, payload } = await this._context.$axios.$post(
        `/api/invitations/${invitation.id}/send`,
        { email: invitation.sentToEmail }
      )

      if (success) {
        this._context.$toastService.success('invitation email sent')

        return payload
      }
    } catch (error) {
      this._context.$toastService.error(error)
    } finally {
      ProgressService.stop()
    }
  }
}
