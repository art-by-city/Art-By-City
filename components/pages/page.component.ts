import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class PageComponent extends Vue {
  errors: string[] = []

  get hasErrors(): boolean {
    return this.errors?.length > 0
  }
}
