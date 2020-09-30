import { injectable, inject } from 'inversify'
import { Router, response } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'
import { InvitationController, InvitationApplicationService } from './'

@injectable()
export default class InvitationControllerImpl implements InvitationController {
  private router!: Router
  private invitationAppService: InvitationApplicationService

  constructor(
    @inject(Symbol.for('InvitationApplicationService'))
    invitationAppService: InvitationApplicationService
  ) {
    this.invitationAppService = invitationAppService
  }

  getRouter(): Router {
    if (!this.router) {
      this.router = this.buildRouter()
    }

    return this.router
  }

  private buildRouter(): Router {
    const router = Router()

    router.use(passport.authenticate('jwt', { session: false }))

    /**
     * @openapi
     *
     * /invitations:
     *  post:
     *    summary: Create a new Invitation
     *    operationId: createInvitation
     *    tags:
     *      - invitations
     *    responses:
     *      '200':
     *        description: The new Invitation
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Invitation"
     *      '500':
     *        description: Unexpected error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Error"
     *            example:
     *              value:
     *                statusCode: 500
     *                message: 'An unknown error has occurred'
     */
    router.post('/', roles(['admin']), async (req, res, next) => {
      try {
        const result = await this.invitationAppService.requestNewInvitation(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /invitations:
     *  get:
     *    summary: List invitations
     *    operationId: listInvitations
     *    tags:
     *      - invitations
     *    responses:
     *      '200':
     *        description: The list of Invitations
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: "#/components/schemas/Invitation"
     *      '500':
     *        description: Unexpected error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Error"
     *            example:
     *              value:
     *                statusCode: 500
     *                message: 'An unknown error has occurred'
     */
    router.get('/', roles(['admin']), async (_req, res, next) => {
      try {
        const result = await this.invitationAppService.fetchInvitations()

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /invitations/{inviteCode}/send:
     *  post:
     *    summary: Send an invitation
     *    operationId: sendInvitation
     *    tags:
     *      - invitations
     *    parameters:
     *      - name: inviteCode
     *        in: path
     *        description: The Invitation Code
     *        required: true
     *        schema:
     *          type: string
     *    requestBody:
     *      description:
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                email:
     *                  description: Email address to send invite to
     *                  type: string
     *                  required: true
     *    responses:
     *      '200':
     *        description: Updated Invitation
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Invitation"
     *      '500':
     *        description: Unexpected error
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Error"
     *            example:
     *              value:
     *                statusCode: 500
     *                message: 'An unknown error has occurred'
     */
    router.post('/:id/send', roles(['admin']), async (req, res, next) => {
      try {
        const result = await this.invitationAppService.sendInvitationEmail(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
