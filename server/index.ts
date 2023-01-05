import ArtByCityNode from '@artbycity/node'
import fs from 'fs'

let adminJWK
try {
  console.log('[ArtByCityNode Middleware] EXM_API_KEY', process.env.EXM_API_KEY)
  console.log(
    '[ArtByCityNode Middleware] ARK_EXM_FUNCTION_ID',
    process.env.ARK_EXM_FUNCTION_ID
  )
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
