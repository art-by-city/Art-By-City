import ArtByCityNode from '@artbycity/node'
import fs from 'fs'

let adminJWK
try {
  const adminJWKPath = process.env.ADMIN_JWK_PATH || 'ADMIN_JWK_PATH not set!'
  console.log('[ArtByCityNode Middleware] ADMIN_JWK_PATH', adminJWKPath)
  const adminJWKBuffer = fs.readFileSync(adminJWKPath)
  adminJWK = JSON.parse(adminJWKBuffer.toString())
  console.log('[ArtByCityNode Middleware] ADMIN_JWK', adminJWK)
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
