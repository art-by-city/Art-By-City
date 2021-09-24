import { Plugin } from '@nuxt/types'

import { RootState } from '~/store'
import InvitationService from '~/services/invitation/service'
import ProfileService from '~/services/profile/service'
import ConfigService from '~/services/config/service'
import CityService from '~/services/city/service'
import ToastService from '~/services/toast/service'
import ChangelogService from '~/services/changelog/service'
import {
  ArtworkService,
  AvatarService,
  TransactionQueueService,
  UserService
} from '~/services'

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
    $userService: UserService
    $txQueueService: TransactionQueueService
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
    $userService: UserService
    $txQueueService: TransactionQueueService
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
    $userService: UserService
    $txQueueService: TransactionQueueService
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
    $userService: UserService
    $txQueueService: TransactionQueueService
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
  inject('userService', new UserService(context))
  inject('txQueueService', new TransactionQueueService(context))
}

export default servicesPlugin
