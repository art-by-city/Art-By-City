const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

const swaggerDefinition = require('./swagger.js')

const app = express()

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: [ './server/core/*/**/*.ts' ]
})

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

const port = process.env.DOCS_PORT || 4000

app.listen(port, () => {
  console.log(`AxBxC Docs listening on port ${port}`)
})
