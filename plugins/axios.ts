import { Context } from '@nuxt/types'

export default function ({ $axios, redirect }: Context) {
  $axios.onError((error: any) => {
    const path = error.request.responseURL.split('/').slice(4).join('/')
    if (
      401 === error.response?.status
      && path !== 'auth/login'
    ) {
      redirect('/login')
    }
  })
}
