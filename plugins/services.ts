import { Plugin } from '@nuxt/types'

import InvitationService from '~/services/invitation/service'
import ProfileService from '~/services/profile/service'
import ConfigService from '~/services/config/service'
import CityService from '~/services/city/service'
import ToastService from '~/services/toast/service'
import ChangelogService from '~/services/changelog/service'
<<<<<<< HEAD
import { UsernameService } from '~/services'
=======
import {
  ArtworkService,
  AvatarService,
  TransactionQueueService,
  UserService,
  LikesService,
  ArweaveService
} from '~/services'
>>>>>>> 62f3fe0b9542379b9049d5b84dcde11b971065d4

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
<<<<<<< HEAD
    $usernameService: UsernameService
=======
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
>>>>>>> 62f3fe0b9542379b9049d5b84dcde11b971065d4
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
<<<<<<< HEAD
    $usernameService: UsernameService
=======
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
>>>>>>> 62f3fe0b9542379b9049d5b84dcde11b971065d4
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
<<<<<<< HEAD
    $usernameService: UsernameService
=======
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
>>>>>>> 62f3fe0b9542379b9049d5b84dcde11b971065d4
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
<<<<<<< HEAD
    $usernameService: UsernameService
=======
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
>>>>>>> 62f3fe0b9542379b9049d5b84dcde11b971065d4
  }
}

const servicesPlugin: Plugin = (context, inject) => {
  inject('invitationService', new InvitationService(context))
  inject('profileService', new ProfileService(context))
  inject('configService', new ConfigService(context))
  inject('cityService', new CityService(context))
  inject('toastService', new ToastService(context))
  inject('changelogService', new ChangelogService(context))
<<<<<<< HEAD
  inject('usernameService', new UsernameService(context))
=======
  inject('avatarService', new AvatarService(context))
  inject('userService', new UserService(context))
  inject('txQueueService', new TransactionQueueService(context))
  inject('likesService', new LikesService(context))
  inject('arweaveService', new ArweaveService(context))

  // Injected last, depends on LikesService
  inject('artworkService', new ArtworkService(context))
>>>>>>> 62f3fe0b9542379b9049d5b84dcde11b971065d4
}

export default servicesPlugin
