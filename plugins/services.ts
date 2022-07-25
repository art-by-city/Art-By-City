import { Plugin } from '@nuxt/types'

import {
  ArtworkService,
  ArweaveService,
  AvatarService,
  LikesService,
  PriceService,
  ProfileService,
  StatsService,
  TipsService,
  TransactionQueueService,
  UserService,
  UsernameService
} from '~/app/services'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $profileService: ProfileService
    $artworkService: ArtworkService
    $usernameService: UsernameService
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
    $tipsService: TipsService
    $priceService: PriceService
    $statsService: StatsService
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside
  // asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $profileService: ProfileService
    $artworkService: ArtworkService
    $usernameService: UsernameService
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
    $tipsService: TipsService
    $priceService: PriceService
    $statsService: StatsService
  }
  // nuxtContext.$myInjectedFunction
  interface Context {
    $profileService: ProfileService
    $artworkService: ArtworkService
    $usernameService: UsernameService
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
    $tipsService: TipsService
    $priceService: PriceService
    $statsService: StatsService
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  interface Store<S> {
    $profileService: ProfileService
    $artworkService: ArtworkService
    $usernameService: UsernameService
    $avatarService: AvatarService
    $userService: UserService
    $txQueueService: TransactionQueueService
    $likesService: LikesService
    $arweaveService: ArweaveService
    $tipsService: TipsService
    $priceService: PriceService
    $statsService: StatsService
  }
}

const servicesPlugin: Plugin = (context, inject) => {
  inject('profileService', new ProfileService(context))
  inject('usernameService', new UsernameService(context))
  inject('avatarService', new AvatarService(context))
  inject('userService', new UserService(context))
  inject('txQueueService', new TransactionQueueService(context))
  inject('likesService', new LikesService(context))
  inject('arweaveService', new ArweaveService(context))
  inject('tipsService', new TipsService(context))
  inject('priceService', new PriceService(context))
  inject('statsService', new StatsService(context))

  // Injected last, depends on LikesService
  inject('artworkService', new ArtworkService(context))
}

export default servicesPlugin
