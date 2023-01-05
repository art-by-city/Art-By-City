import ArtByCityNode from '@artbycity/node'
import fs from 'fs'

const adminJWKPath = process.env.ADMIN_JWK_PATH || 'ADMIN_JWK_PATH not set!'
const adminJWKBuffer = fs.readFileSync(adminJWKPath)
const adminJWK = JSON.parse(adminJWKBuffer.toString())

const abc = new ArtByCityNode(adminJWK)
  .app
  .callback()

export default abc
