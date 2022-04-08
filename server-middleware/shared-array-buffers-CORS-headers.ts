import http from 'http'

export default function (
  req: http.ClientRequest,
  res: http.ServerResponse,
  next: Function
) {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')

  next()
}
