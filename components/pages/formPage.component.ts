import { Vue, Watch } from 'nuxt-property-decorator'

import PageComponent from './page.component'

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
    return [(v: string) => (v || '') !== '' || 'This field is required']
  }
}
