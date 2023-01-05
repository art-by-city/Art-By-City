import ArtByCityNode from '@artbycity/node'
import fs from 'fs'

let adminJWK
try {
  const adminJWKPath = process.env.ADMIN_JWK || 'ADMIN_JWK not set!'
  const adminJWKBuffer = fs.readFileSync(adminJWKPath)
  adminJWK = JSON.parse(adminJWKBuffer.toString())
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
