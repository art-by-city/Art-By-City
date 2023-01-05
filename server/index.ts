import ArtByCityNode from '@artbycity/node'
import fs from 'fs'

let adminJWK
try {
  const adminJWKPath = process.env.ADMIN_JWK_PATH || 'ADMIN_JWK_PATH not set!'
  const adminJWKBuffer = fs.readFileSync(adminJWKPath)
  adminJWK = JSON.parse(adminJWKBuffer.toString())
} catch (error) {
  console.error('Error bootstrapping ArtByCityNode', error)
}

const abc = new ArtByCityNode(adminJWK)
  .app
  .callback()

export default abc
