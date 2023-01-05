import ArtByCityNode from '@artbycity/node'
import fs from 'fs'

import { CONFIG } from '@artbycity/node/dist/util'

let adminJWK
try {
  console.log(
    '[ArtByCityNode Middleware] USER_UPLOAD_BUCKET_NAME',
    process.env.USER_UPLOAD_BUCKET_NAME
  )
  console.log('[ArtByCityNode Middleware] EXM_API_KEY', CONFIG.EXM_API_KEY)
  console.log(
    '[ArtByCityNode Middleware] ARK_EXM_FUNCTION_ID',
    CONFIG.ARK_EXM_FUNCTION_ID
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
