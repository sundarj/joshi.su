'use strict'

global.setting = Object.assign(require('./package.json').config, {
  root: __dirname,
})

const Hapi = require('hapi')
const Path = require('path')

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'exports'),
      },
    },
  },
})

server.connection({ port: 8080 })

const routes = require('require-all')(`${__dirname}/routes`)

server.register([ require('inert'), require('hapi-accept-language') ], err => {
  
  if (err) throw err
  
  server.route(routes.api)
  server.route(routes.static)
  
  server.ext('onPostHandler', (request, respondWith) => {

    const response = request.response
    
    if (response.isBoom &&
      response.output.statusCode === 404) {

      return respondWith.file('index.html')
    }

    return respondWith.continue()
  })
  
  server.start(err => {
    
    if (err) throw err
    
    console.log(`server listening on ${server.info.uri}`)
  })
})
