import { Context } from '@nuxt/types'

export default function ({ $axios, redirect, $auth }: Context) {
  $axios.onError((error) => {
    if (401 === error.response?.status) {
      redirect('/login')
    }
  })
}
