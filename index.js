"use strict"

const Hapi = require('hapi')
const Hoek = require('hoek')
const Bell = require('bell')
const Handlebars = require('handlebars')

const KEY = process.env.TWITTER_KEY
const SECRET = process.env.TWITTER_SECRET
const PORT = process.env.PORT || 9966
const pg = require('pg')

pg.defaults.ssl = true

const server = new Hapi.Server()

const plugins = require('./plugins')

server.connection({
  port: PORT
})

server.register(plugins, (err) => {
  if(err) {
    Hoek.assert(!err, err)
  }

  server.views({
    engines: {
      html: Handlebars
    },
    layout: true,
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layouts',
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      return reply.view('login')
    }
  })

  server.start(err => {
    if(err) {
      console.error(err)
    }

    console.log('Server listening on at:', server.info.uri)
  })
})

