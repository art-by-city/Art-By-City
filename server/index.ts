import ArtByCityNode from '@artbycity/node'
import fs from 'fs'

let adminJWK
try {
  const adminJWKPath = process.env.ADMIN_JWK || 'ADMIN_JWK not set!'
  console.log('[ArtByCityNode Middleware] ADMIN_JWK', adminJWKPath)
  const adminJWKBuffer = fs.readFileSync(adminJWKPath)
  adminJWK = JSON.parse(adminJWKBuffer.toString())
  console.log('[ArtByCityNode Middleware] json ADMIN_JWK', adminJWK)
} catch (error) {
  console.error(
    '[ArtByCityNode Middleware] Error bootstrapping ArtByCityNode',
    error
  )
}

const abc = new ArtByCityNode(adminJWK)
  .app
  .callback()

export default abc
