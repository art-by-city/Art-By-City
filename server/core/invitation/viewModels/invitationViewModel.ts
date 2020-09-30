import ViewModel from '../../api/viewModel'
import { UserViewModel } from '../../user'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Invitation:
 *      properties:
 *        id:
 *          type: string
 *        created:
 *          type: string
 *        updated:
 *          type: string
 *        createdByUser:
 *          $ref: "#/components/schemas/User"
 *        sent:
 *          type: boolean
 *        sentOn:
 *          type: string
 *        sentToEmail:
 *          type: string
 *        used:
 *          type: boolean
 *        usedOn:
 *          type: string
 *        usedByUser:
 *          $ref: "#/components/schemas/User"
 */
export default interface InvitationViewModel extends ViewModel {
  id: string
  created: Date
  updated: Date
  createdByUser: UserViewModel
  sent?: boolean
  sentOn?: Date
  sentToEmail?: string
  used?: boolean
  usedOn?: Date
  usedByUser?: UserViewModel
}
