import ViewModel from '../../api/viewModel'
import { CityViewModel } from '../../city'
import { ArtworkType } from '../../artwork'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    Config:
 *      properties:
 *        cities:
 *          type: array
 *          items:
 *            $ref: "#/components/schemas/City"
 *        hashtags:
 *          type: array
 *          items:
 *            type: string
 *        maxUserArtworks:
 *          type: number
 *        artworkTypes:
 *          type: array
 *          items:
 *            $ref: "#/components/schemas/ArtworkType"
 */
export default interface ConfigViewModel extends ViewModel {
  cities: CityViewModel[]
  hashtags: string[]
  maxUserArtworks: number
  artworkTypes: ArtworkType[]
}
