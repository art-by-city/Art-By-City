import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'
import { AdminController, AdminService } from './'

@injectable()
export default class AdminControllerImpl implements AdminController {
  private router!: Router
  private adminService: AdminService

  constructor(
    @inject(Symbol.for('AdminService'))
    adminService: AdminService
  ) {
    this.adminService = adminService
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
    router.use(roles(['admin']))

    /**
     * @openapi
     *
     * /admin/artworks:
     *  get:
     *    summary: List artworks for Admin
     *    operationId: listArtworksForAdmin
     *    tags:
     *      - admin
     *      - artworks
     *    responses:
     *      '200':
     *        description: An array of Artworks
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: "#/components/schemas/Artwork"
     */
    router.get('/artwork', async (_req, res, next) => {
      try {
        const result = await this.adminService.listArtwork()

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /admin/cities:
     *  get:
     *    summary: List Cities for Admin
     *    operationId: listCitiesForAdmin
     *    tags:
     *      - admin
     *      - cities
     *    responses:
     *      '200':
     *        description: An array of Cities
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: "#/components/schemas/City"
     */
    router.get('/cities', async (_req, res, next) => {
      try {
        const result = await this.adminService.listCities()

        return res.json(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /admin/users:
     *  get:
     *    summary: List Users for Admin
     *    operationId: listUsersForAdmin
     *    tags:
     *      - admin
     *    responses:
     *      '200':
     *        description: An array of Users
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: "#/components/schemas/User"
     */
    router.get('/users', async (_req, res, next) => {
      try {
        const result = await this.adminService.listUsers()

        return res.json(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /admin/user:
     *  post:
     *    summary: Update a User for Admin
     *    operationId: updateUserForAdmin
     *    tags:
     *      - admin
     *    requestBody:
     *      description: The User to update
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/User"
     *    responses:
     *      '200':
     *        description: Null response
     */
    router.post('/user', async (req, res, next) => {
      try {
        const result = await this.adminService.saveUser(req.body.user)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
