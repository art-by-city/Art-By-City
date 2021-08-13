import ArLocal from '@textury/arlocal'
import HttpProxy from 'http-proxy'
import express, { Response } from 'express'
import cron from 'node-cron'
import fetch from 'node-fetch'

const HOST = process.env.HOST || 'localhost'

const PROXY_OPTS = {
  target: {
    protocol: 'http',
    host: HOST,
    port: 1984
  }
}
const PROXY_PORT = process.env.ARWEAVE_PORT || 1987

const ARLOCAL_DB_PATH = process.env.ARLOCAL_DB_PATH || undefined

const LOGGING = false

const app = express()

const startServer = async () => {
  // Setup ArLocal
  const arLocal = new ArLocal(1984, LOGGING, ARLOCAL_DB_PATH)
  await arLocal.start()

  // Setup ArLocal Proxy
  const arlocalProxy = HttpProxy.createProxyServer(PROXY_OPTS)

  // TODO -> CORS ?

  // Disable /mining endpoints to arlocal
  function send405(res: Response) {
    res.status(405)
    res.send()
  }
  app.use('/mine', (req, res, next) => {
    send405(res)
  })
  app.use('/mine/:n', (req, res, next) => {
    send405(res)
  })

  // Wire proxy to ArLocal
  app.use((req, res) => {
    console.log('proxy endpoint hit!')
    arlocalProxy.web(req, res)
  })

  // Mining cron task
  cron.schedule('* * * * *', async () => {
    try {
      console.log('trying to mine!')
      const res = await fetch(`http://${HOST}:1984/mine`)
      // if (LOGGING) {
        console.log('mining result', await res.json())
      // }
    } catch (error) {
      console.error('Error calling /mine endpoint', error)
    }
  })

  app.listen(PROXY_PORT, () => {
    console.log(`arlocal proxy started on port ${PROXY_PORT}`)
  })
}

// (async () => {
//   await startServer()
// })()

// Let normal Nuxt requests go where they need to go!
export default function (_req: any, _res: any, next: () => {} ) { next() }
