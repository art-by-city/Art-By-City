import { Context } from '@nuxt/types'

export default function ({ $axios, redirect, $auth }: Context) {
  $axios.onError((error) => {
    const path = error.request.responseURL.split('/').slice(4).join('/')
    if (
      401 === error.response?.status
      && path !== 'auth/login'
    ) {
      redirect('/login')
    }
  })
}
