import ArLocal from '@textury/arlocal'
import HttpProxy from 'http-proxy'
import express, { Response } from 'express'
import cron from 'node-cron'
import fetch from 'node-fetch'

const PROXY_OPTS = {
  target: {
    protocol: 'http',
    host: 'localhost',
    port: 1984
  }
}
const PROXY_PORT = 1987

const LOGGING = false

const app = express()

const startServer = async () => {
  // Setup ArLocal
  const arLocal = new ArLocal(1984, LOGGING)
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
    arlocalProxy.web(req, res)
  })

  // Mining cron task
  cron.schedule('* * * * *', async () => {
    const res = await fetch('http://localhost:1984/mine')
    if (LOGGING) {
      console.log('mining result', await res.json())
    }
  })

  app.listen(PROXY_PORT, () => {
    console.log(`arlocal proxy started on port ${PROXY_PORT}`)
  })
}

(async () => {
  await startServer()
})()

// Let normal Nuxt requests go where they need to go!
export default function (_req: any, _res: any, next: () => {} ) { next() }
