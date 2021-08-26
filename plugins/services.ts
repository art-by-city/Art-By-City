import { Plugin } from '@nuxt/types'

import InvitationService from '~/services/invitation/service'
import ProfileService from '~/services/profile/service'
import ArtworkService from '~/services/artwork/service'
import ConfigService from '~/services/config/service'
import CityService from '~/services/city/service'
import ToastService from '~/services/toast/service'
import ChangelogService from '~/services/changelog/service'
import AvatarService from '~/services/avatar'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $invitationService: InvitationService
    $profileService: ProfileService
    $artworkService: ArtworkService
    $configService: ConfigService
    $cityService: CityService
    $toastService: ToastService
    $changelogService: ChangelogService
    $avatarService: AvatarService
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $invitationService: InvitationService
    $profileService: ProfileService
    $artworkService: ArtworkService
    $configService: ConfigService
    $cityService: CityService
    $toastService: ToastService
    $changelogService: ChangelogService
    $avatarService: AvatarService
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $invitationService: InvitationService
    $profileService: ProfileService
    $artworkService: ArtworkService
    $configService: ConfigService
    $cityService: CityService
    $toastService: ToastService
    $changelogService: ChangelogService
    $avatarService: AvatarService
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $invitationService: InvitationService
    $profileService: ProfileService
    $artworkService: ArtworkService
    $configService: ConfigService
    $cityService: CityService
    $toastService: ToastService
    $changelogService: ChangelogService
    $avatarService: AvatarService
  }
}

const servicesPlugin: Plugin = (context, inject) => {
  inject('invitationService', new InvitationService(context))
  inject('profileService', new ProfileService(context))
  inject('artworkService', new ArtworkService(context))
  inject('configService', new ConfigService(context))
  inject('cityService', new CityService(context))
  inject('toastService', new ToastService(context))
  inject('changelogService', new ChangelogService(context))
  inject('avatarService', new AvatarService(context))
}

export default servicesPlugin
