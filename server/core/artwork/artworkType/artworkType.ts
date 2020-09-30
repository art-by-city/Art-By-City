/**
 * @openapi
 *
 * components:
 *  schemas:
 *    ArtworkType:
 *      properties:
 *        name:
 *          type: string
 *          required: true
 *        visible:
 *          type: boolean
 *        enabled:
 *          type: boolean
 */
export default class ArtworkType {
  name!: string
  visible!: boolean
  enabled!: boolean
}
