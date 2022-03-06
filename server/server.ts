import Arweave from 'arweave'
import ArDB from '@textury/ardb'
import ArdbTransaction from '@textury/ardb/lib/models/transaction'
import sharp from 'sharp'
import { IncomingMessage, ServerResponse } from 'http'

import { LegacyArtwork, LegacyArtworkImage, Avatar } from '~/types'

export default async function (
  req: IncomingMessage,
  res: ServerResponse,
  next: Function
) {
  try {
    const pathParts = (req.url as string || '').split('/')
    if (pathParts[1] === 'avatar' || pathParts[1] === 'artwork') {
      const category = pathParts[1]
      const owner = pathParts[2]
      if (owner) {
        const arweave = new Arweave({
          protocol: process.env.ARWEAVE_PROTOCOL || 'http',
          host: process.env.ARWEAVE_HOST || 'localhost',
          port: process.env.ARWEAVE_PORT || 1984
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
            const artwork = txResult.data as LegacyArtwork
            const image = artwork.images[0] as LegacyArtworkImage
            matches = image.dataUrl.match('data:(image/.*);base64,(.*)')
          }

          if (matches) {
            // const imageType = matches[1]
            const imageDataBase64 = matches[2]

            // NB: can remove once Minds updates user agent
            let format: 'webp' | 'png' = 'webp'
            if (req.headers['user-agent']?.startsWith('MindsMediaProxy/3.0')) {
              format = 'png'
            }

            const thumbnail = await generateThumbnail(
              Buffer.from(imageDataBase64, 'base64'),
              format
            )

            res.setHeader('Content-Type', `image/${format}`)
            res.end(thumbnail)
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

async function generateThumbnail(image: Buffer, format: 'webp' | 'png'):
  Promise<Buffer> {
  return sharp(image).resize(4096, 4096, {
    fit: sharp.fit.inside,
    withoutEnlargement: true
  }).toFormat(format).toBuffer()
}
