import Arweave from 'arweave'
import ArDB from '@textury/ardb'
import ArdbTransaction from '@textury/ardb/lib/models/transaction'

import { Artwork, ArtworkImage, Avatar } from '~/types'

export default async function (req: any, res: any, next: any) {
  try {
    const pathParts = (req.url as string || '').split('/')
    if (pathParts[1] === 'avatar' || pathParts[1] === 'artwork') {
      const category = pathParts[1]
      const owner = pathParts[2]
      if (owner) {
        const arweave = new Arweave({
          protocol: process.env.ARWEAVE_PROTOCOL || 'http',
          host: process.env.ARWEAVE_HOST || 'localhost',
          port: 1984
        })

        const ardb = new ArDB(arweave, 2)

        let query = ardb
          .search('transactions')
          .appName(process.env.APP_NAME || 'ArtByCity-Development')
          .tag('Category', category)
          .type('application/json')
          .from(owner)

        if (category === 'artwork') {
          const slug = pathParts[3]
          query.tag('slug', slug)
        }

        const txs = await query.find({ sort: 'HEIGHT_DESC' }) as ArdbTransaction[]

        let txId = txs[0]?.id || ''

        if (!txId && category === 'artwork') {
          txId = pathParts[3]
        }

        if (txId) {
          let matches: RegExpMatchArray | null = null

          const txResult = await arweave.api.get(txId)

          if (category === 'avatar') {
            const avatar = txResult.data as Avatar
            matches = avatar.src.match('data:(image/.*);base64,(.*)')
          }

          if (category === 'artwork') {
            const artwork = txResult.data as Artwork
            const image = artwork.images[0] as ArtworkImage
            matches = image.dataUrl.match('data:(image/.*);base64,(.*)')
          }

          if (matches) {
            const imageType = matches[1]
            const imageDataBase64 = matches[2]

            res.setHeader('Content-Type', imageType)
            res.end(Buffer.from(imageDataBase64, 'base64'))
          } else {
            next()
          }
        } else {


          next()
        }
      } else {
        next()
      }
    } else {
      next()
    }
  } catch (err) {
    console.error('Error in server.ts', err)
    next()
  }
}
