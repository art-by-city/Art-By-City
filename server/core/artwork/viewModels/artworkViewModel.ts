import ViewModel from '../../api/viewModel'
import { UserViewModel } from '../../user'
import { ArtworkImage } from '../'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Artwork:
 *      properties:
 *        id:
 *          type: string
 *        owner:
 *          type: string
 *          required: true
 *        title:
 *          type: string
 *          required: true
 *        type:
 *          type: string
 *          required: true
 *        city:
 *          type: string
 *          required: true
 *        hashtags:
 *          type: array
 *          required: true
 *          items:
 *            type: string
 *        images:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              source:
 *                type: string
 *        likes:
 *          type: array
 *          items:
 *            type: string
 *        published:
 *          type: boolean
 *        approved:
 *          type: boolean
 */
export default interface ArtworkViewModel extends ViewModel {
  id: string
  owner: UserViewModel
  title: string
  description: string
  type: string
  city: string
  hashtags: string[]
  images: ArtworkImage[]
  likes: string[]
  published: boolean
  approved: boolean
}
