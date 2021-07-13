import { injectable, inject } from 'inversify'
import { Router } from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'

import roles from '../middleware/roles'
import { User } from '../user'
import { ArtworkApplicationService, ArtworkController } from './'

@injectable()
export default class ArtworkControllerImpl implements ArtworkController {
  private router!: Router
  private artworkAppService: ArtworkApplicationService

  constructor(
    @inject(Symbol.for('ArtworkApplicationService'))
    artworkAppService: ArtworkApplicationService
  ) {
    this.artworkAppService = artworkAppService
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

    const normalLimit = bodyParser.json()
    const increasedUploadLimit = bodyParser.json({ limit: '200mb' })

    /**
     * @openapi
     *
     * /artworks:
     *  post:
     *    summary: Create a new Artwork
     *    operationId: createArtwork
     *    tags:
     *      - artworks
     *    requestBody:
     *      description: The Artwork to create
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schemas/Artwork"
     *    responses:
     *      '201':
     *        description: Null response
     *        headers:
     *          Location:
     *            description: URL of newly created Artwork
     *            schema:
     *              type: string
     */
    router.post('/', increasedUploadLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.create({
          userId: (<User>req.user).id,
          ...req.body.artwork
        })

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/{artworkIdOrSlug}:
     *  get:
     *    summary: Fetch an Artwork
     *    operationId: getArtworkByIdOrSlug
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkIdOrSlug
     *        in: path
     *        required: true
     *        description: The Artwork ID or URL Slug
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: The requested Artwork
     *        content:
     *          application/json:
     *            schema:
     *              $ref: "#/components/schemas/Artwork"
     */
    router.get('/:idOrSlug', normalLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.get(req.params.idOrSlug)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks:
     *  get:
     *    summary: List Artworks
     *    operationId: listArtworks
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: limit
     *        in: query
     *        description: Maximum number of Artworks to return
     *        required: false
     *        schema:
     *          type: integer
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
    router.get('/', normalLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.list(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/{artworkId}:
     *  put:
     *    summary: Update an Artwork
     *    operationId: updateArtwork
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkId
     *        in: path
     *        required: true
     *        description: The Artwork ID
     *        schema:
     *          type: string
     *    requestBody:
     *      description: The Artwork to update
     *      content:
     *        application/json:
     *          schema:
     *            $ref: "#/components/schema/Artwork"
     *    responses:
     *      '200':
     *        description: Null response
     */
    router.put('/:id', increasedUploadLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.update({
          userId: (<User>req.user).id,
          ...req.body.artwork
        })

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/${artworkId}:
     *  delete:
     *    summary: Delete an Artwork
     *    operationId: deleteArtwork
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkId
     *        in: path
     *        required: true
     *        description: The Artwork ID
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: Null response
     */
    router.delete('/:id', normalLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.delete(
          <User>req.user,
          req.params.id
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/{artworkId}/publish:
     *  post:
     *    summary: Publish an Artwork
     *    operationId: publishArtwork
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkId
     *        in: path
     *        required: true
     *        description: The Artwork ID
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: Null response
     */
    router.post('/:id/publish', normalLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.publish(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/{artworkId}/unpublish:
     *  post:
     *    summary: Unpublish an Artwork
     *    operationId: unpublishArtwork
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkId
     *        in: path
     *        required: true
     *        description: The Artwork ID
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: Null response
     */
    router.post('/:id/unpublish', normalLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.unpublish(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/{artworkId}/approve:
     *  post:
     *    summary: Approve an Artwork
     *    operationId: approveArtwork
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkId
     *        in: path
     *        required: true
     *        description: The Artwork ID
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: Null response
     */
    router.post('/:id/approve', normalLimit, roles(['admin']), async (req, res, next) => {
      try {
        const result = await this.artworkAppService.approve(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/{artworkId}/unapprove:
     *  post:
     *    summary: Unapprove an Artwork
     *    operationId: unapproveArtwork
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkId
     *        in: path
     *        required: true
     *        description: The Artwork ID
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: Null response
     */
    router.post('/:id/unapprove', normalLimit, roles(['admin']), async (req, res, next) => {
      try {
        const result = await this.artworkAppService.unapprove(req)

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/{artworkId}/like:
     *  post:
     *    summary: Like an Artwork
     *    operationId: likeArtwork
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkId
     *        in: path
     *        required: true
     *        description: The Artwork ID
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: Null response
     */
    // TODO -> should be post?
    router.put('/:id/like', normalLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.like(
          <User>req.user,
          req.params.id
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    /**
     * @openapi
     *
     * /artworks/{artworkId}/unlike:
     *  post:
     *    summary: Unlike an Artwork
     *    operationId: unlikeArtwork
     *    tags:
     *      - artworks
     *    parameters:
     *      - name: artworkId
     *        in: path
     *        required: true
     *        description: The Artwork ID
     *        schema:
     *          type: string
     *    responses:
     *      '200':
     *        description: Null response
     */
    // TODO -> should be post?
    router.delete('/:id/like', normalLimit, async (req, res, next) => {
      try {
        const result = await this.artworkAppService.unlike(
          <User>req.user,
          req.params.id
        )

        return res.send(result)
      } catch (error) {
        next(error)
      }
    })

    return router
  }
}
