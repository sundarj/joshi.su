'use strict'

global.setting = Object.assign(require('./package.json').config, {
  root: __dirname,
})

const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({ port: 8080 })

const routes = require('require-all')(`${__dirname}/routes`)

server.register(require('inert'), err => {
  
  if (err) throw err
  
  server.route(routes.api)
  server.route(routes.static)
  
  server.start(err => {
    
    if (err) throw err
    
    console.log(`server listening on ${server.info.uri}`)
  })
})
