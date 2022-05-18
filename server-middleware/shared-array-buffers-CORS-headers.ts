import http from 'http'

export default function (
  req: http.ClientRequest,
  res: http.ServerResponse,
  next: Function
) {
  // if ((req as any).url === '/publish/audio') {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  // }

  next()
}
