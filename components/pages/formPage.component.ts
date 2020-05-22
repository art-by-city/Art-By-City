import { Vue, Watch } from 'nuxt-property-decorator'

import PageComponent from './page.component'
import { required } from '~/server/core/validators'

export type VForm = Vue & { validate: () => boolean }

export default class FormPageComponent extends PageComponent {
  valid = false
  success = false
  form(): VForm {
    return this.$refs.form as VForm
  }

  @Watch('validate')
  validate() {
    this.form().validate()
  }

  get required() {
    return required()
  }
}
