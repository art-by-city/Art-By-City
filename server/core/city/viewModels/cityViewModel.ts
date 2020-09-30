import ViewModel from '../../api/viewModel'

/**
 * @openapi
 *
 * components:
 *  schemas:
 *    City:
 *      required:
 *        - id
 *        - code
 *        - name
 *        - country
 *      properties:
 *        id:
 *          type: string
 *        code:
 *          type: string
 *        name:
 *          type: string
 *        country:
 *          type: string
 *        visible:
 *          type: boolean
 *        disabled:
 *          type: boolean
 */
export default interface CityViewModel extends ViewModel {
  id: string
  code: string
  name: string
  country: string
  visible?: boolean
  disabled?: boolean
}
