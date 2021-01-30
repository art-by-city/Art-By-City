import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'

import { ArtworkApplicationService } from '../artwork'
import { User, UserController, UserApplicationService } from './'
import { ProfileUpdateRequest } from './requests'

@injectable()
export default class UserControllerImpl implements UserController {
  private router!: Router

  private artworkAppService: ArtworkApplicationService
  private userAppService: UserApplicationService

  constructor(
    @inject(Symbol.for('ArtworkApplicationService'))
    artworkAppService: ArtworkApplicationService,
    @inject(Symbol.for('UserApplicationService'))
    userAppService: UserApplicationService
  ) {
    this.artworkAppService = artworkAppService
    this.userAppService = userAppService
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

    const normalLimits = bodyParser.json()
    const avatarUploadLimit = bodyParser.json({ limit: '5mb' })

    /**
     * @openapi
     *
     * /user/portfolio:
     *  get:
     *    summary: Get Portfolio for authenticated User
     *    operationId: getPortfolioForUser
     *    tags:
     *      - user
     *      - artworks
     *    responses:
     *      '200':
     *        description:
     *          content:
     *            application/json:
     *              schema:
     *                type: array
     *                items:
     *                  $ref: "#/components/schemas/Artwork"
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
    router.get('/portfolio', normalLimits, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.listByUser(
          <User>req.user,
          {
            includeUnapproved: true,
            includeUnpublished: true
          }
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /user/account:
     *  get:
     *    summary: Get Account for authenticated User
     *    operationId: getAccountForUser
     *    tags:
     *      - user
     *    responses:
     *      '200':
     *        description: The User's Account
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/UserAccount"
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
    router.get('/:id/account', normalLimits, async (req, res, next) => {
      try {
        const result = await this.userAppService.getUserAccount(req.params.id)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /users/{username}/profile:
     *  get:
     *    summary: Get a profile for a given username
     *    operationId: getProfileByUsername
     *    tags:
     *      - user
     *    parameters:
     *      - name: username
     *        in: path
     *        requred: true
     *        description: The username
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: The UserProfile
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/UserProfile"
     *      '404':
     *        description: User not found
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
    router.get('/:username/profile', normalLimits, async (req, res, next) => {
      try {
        const result = await this.userAppService.getUserProfile(req.params.username)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /user/avatar:
     *  post:
     *    summary: Upload a UserAvatar for authenticated User
     *    operationId: uploadAvatar
     *    tags:
     *      - user
     *    requestBody:
     *      description: UserAvatar upload request
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              image:
     *                type: string
     *                format: binary
     *                required: true
     *              type:
     *                type: string
     *                required: true
     *    responses:
     *      '200':
     *        description: The UserAvatar
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/UserAvatar"
     *      '409':
     *        description: Invalid UserAvatar
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
    router.post('/avatar', avatarUploadLimit, async (req, res, next) => {
      try {
        const result = await this.userAppService.uploadAvatar(
          <User>req.user,
          req.body.image,
          req.body.type
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    // TODO -> Docs
    router.post('/profile', normalLimits, async (req, res, next) => {
      try {
        const result = await this.userAppService.updateUserProfile(
          <User>req.user,
          <ProfileUpdateRequest>req.body
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
