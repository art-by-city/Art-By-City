import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import { AuthService } from '../auth'
import { User, UserService, UserMapper } from '../user'
import { AuthController } from './'

@injectable()
export default class AuthControllerImpl implements AuthController {
  private authService: AuthService
  private userService: UserService

  private router!: Router

  constructor(
    @inject(Symbol.for('AuthService'))
    authService: AuthService,
    @inject(Symbol.for('UserService'))
    userService: UserService
  ) {
    this.authService = authService
    this.userService = userService
  }

  getRouter(): Router {
    if (!this.router) {
      this.router = this.buildRouter()
    }

    return this.router
  }

  private buildRouter(): Router {
    const router = Router()

    const localAuth = passport.authenticate('local')
    const jwtAuth = passport.authenticate('jwt', { session: false })

    /**
     * @openapi
     *
     * /auth/login:
     *  post:
     *    summary: Authenticate
     *    operationId: login
     *    tags:
     *      - auth
     *    requestBody:
     *      description: Authentication credentials
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              username:
     *                description: Username or Email
     *                type: string
     *                required: true
     *              password:
     *                type: string
     *                required: true
     *    responses:
     *      '200':
     *        description: Authentication successful, user and auth token provided
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/AuthenticationResult"
     *      '401':
     *        description: Unauthorized, bad credentials
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
    router.post('/login', localAuth, (req, res, next) => {
      try {
        const result = this.authService.login(new UserMapper().toViewModel(<User>req.user))

        return res.json(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /auth/logout:
     *  post:
     *    summary: De-authenticate
     *    operationId: logout
     *    tags:
     *      - auth
     *    responses:
     *      '200':
     *        description: De-authentication successful
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
    router.post('/logout', (_req, res, next) => {
      try {
        return res.send()
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /auth/user:
     *  get:
     *    summary: Auth module User object fetch endpoint
     *    operationId: getAuthUser
     *    tags:
     *      - auth
     *    responses:
     *      '200':
     *        description: The authenticated User
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/User"
     *      '401':
     *        description: Unauthorized
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
    router.get('/user', jwtAuth, (req, res, next) => {
      try {
        const user = new UserMapper().toViewModel(<User>req.user)

        return res.json({ user })
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /auth/register:
     *  post:
     *    summary: Register a new user
     *    operationId: register
     *    tags:
     *      - auth
     *    requestBody:
     *      description: User registration request
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              username:
     *                type: string
     *                required: true
     *              email:
     *                type: string
     *                required: true
     *              password:
     *                type: string
     *                required: true
     *              city:
     *                type: string
     *                required: true
     *              inviteCode:
     *                type: string
     *                required: true
     *    responses:
     *      '200':
     *        description: Registration successful, user and auth token provided
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/AuthenticationResult"
     *      '409':
     *        description: Validation error with authentication request
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Error"
     *            examples:
     *              'Invalid Invitation Code':
     *                value:
     *                  statusCode: 409
     *                  message: 'Invalid code or code already used'
     *              'Username Already Taken':
     *                value:
     *                  statusCode: 409
     *                  message: 'Username already taken'
     *              'Email Already Taken':
     *                value:
     *                  statusCode: 409
     *                  message: 'Email already taken'
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
    router.put('/register', async (req, res, next) => {
      try {
        const user = await this.userService.register(req)

        const result = this.authService.login(user)

        return res.json(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /auth/update:
     *  post:
     *    summary: Update user password
     *    operationId: updatePassword
     *    tags:
     *      - auth
     *    requestBody:
     *      description: User update password request
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              newPassword:
     *                type: string
     *                required: true
     *    responses:
     *      '200':
     *        description: Password update successful
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
    router.post('/update', localAuth, async (req, res, next) => {
      try {
        const user = <User>req.user
        const result = await this.userService.updatePassword(
          user.id,
          req.body.newPassword
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    // TODO ???????????????????????
    // router.post('/refresh', jwtAuth, async (req, res, next) => {

    // })

    return router
  }
}
