import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'

import roles from '../middleware/roles'
import { CityController, CityApplicationService } from './'

@injectable()
export default class CityControllerImpl implements CityController {
  private router!: Router
  private cityAppService: CityApplicationService

  constructor(
    @inject(Symbol.for('CityApplicationService'))
    cityApplicationService: CityApplicationService
  ) {
    this.cityAppService = cityApplicationService
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
     * /cities:
     *  post:
     *    summary: Create a City
     *    operationId: createCity
     *    tags:
     *      - cities
     *    requestBody:
     *      description: City creation request
     *      content:
     *        application/json:
     *          schema:
     *            type: object
     *            properties:
     *              code:
     *                type: string
     *                required: true
     *              name:
     *                type: string
     *                required: true
     *              country:
     *                type: string
     *                required: true
     *              visible:
     *                type: boolean
     *              disabled:
     *                type: boolean
     *    responses:
     *      '200':
     *        description: City created
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/City"
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
    router.put('/', async (req, res) => {
      const result = await this.cityAppService.create(req)

      return res.send(result)
    })

    /**
     * @openapi
     *
     * /cities/{cityId}:
     *  put:
     *    summary: Update a City
     *    operationId: updateCity
     *    tags:
     *      - cities
     *    parameters:
     *      - name: cityId
     *        in: path
     *        required: true
     *        description: The City ID
     *        schema:
     *          type: string
     *    requestBody:
     *      description: City update request
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/City"
     *    responses:
     *      '200':
     *        description: City update successful
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/City"
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
    router.post('/:id', async (req, res) => {
      const result = await this.cityAppService.update(req)

      return res.send(result)
    })

    /**
     * @openapi
     *
     * /cities:
     *  get:
     *    summary: List Cities
     *    operationId: listCities
     *    tags:
     *      - cities
     *    responses:
     *      '200':
     *        description: List of Cities
     *        content:
     *          application/json:
     *            schema:
     *              type: array
     *              items:
     *                $ref: "#/components/schemas/City"
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
    router.get('/', async (_req, res) => {
      const result = await this.cityAppService.list()

      return res.send(result)
    })

    /**
     * @openapi
     *
     * /cities/{cityId}:
     *  delete:
     *    summary: Delete a City
     *    operationId: deleteCity
     *    tags:
     *      - cities
     *    parameters:
     *      - name: cityId
     *        in: path
     *        required: true
     *        description: The City ID
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: Null response
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
    router.delete('/:id', async (req, res) => {
      const result = await this.cityAppService.delete(req)

      return res.send(result)
    })

    return router
  }
}
