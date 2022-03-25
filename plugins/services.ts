import { Plugin } from '@nuxt/types'

import InvitationService from '~/services/invitation/service'
import ProfileService from '~/services/profile/service'
import ConfigService from '~/services/config/service'
import CityService from '~/services/city/service'
import ToastService from '~/services/toast/service'
import {
  ArtworkService,
  ArweaveService,
  AvatarService,
  LikesService,
  PriceService,
  TipsService,
  TransactionQueueService,
  UserService,
  UsernameService
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
    $usernameService: UsernameService
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
    $tipsService: TipsService
    $priceService: PriceService
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
    $usernameService: UsernameService
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
    $tipsService: TipsService
    $priceService: PriceService
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $invitationService: InvitationService
    $profileService: ProfileService
    $artworkService: ArtworkService
    $configService: ConfigService
    $cityService: CityService
    $toastService: ToastService
    $usernameService: UsernameService
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
    $tipsService: TipsService
    $priceService: PriceService
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
    $usernameService: UsernameService
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
    $tipsService: TipsService
    $priceService: PriceService
  }
}

const servicesPlugin: Plugin = (context, inject) => {
  inject('invitationService', new InvitationService(context))
  inject('profileService', new ProfileService(context))
  inject('configService', new ConfigService(context))
  inject('cityService', new CityService(context))
  inject('toastService', new ToastService(context))
  inject('usernameService', new UsernameService(context))
  inject('avatarService', new AvatarService(context))
  inject('userService', new UserService(context))
  inject('txQueueService', new TransactionQueueService(context))
  inject('likesService', new LikesService(context))
  inject('arweaveService', new ArweaveService(context))
  inject('tipsService', new TipsService(context))
  inject('priceService', new PriceService(context))

  // Injected last, depends on LikesService
  inject('artworkService', new ArtworkService(context))
}

export default servicesPlugin
