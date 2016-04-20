'use strict'

const Hapi = require('hapi')
const Handlebars = require('handlebars')
const pg = require('pg')
const guid = require('aguid')

const server = new Hapi.Server()
const PORT = process.env.PORT || 9966
const cookiePW = process.env.COOKIE_PW || guid()

pg.defaults.ssl = true

const plugins = require('./plugins')
const routes = require('./routes')


server.connection({ port: PORT})

server.register(plugins, err => {
  if(err) {
    throw err
  }

  server.auth.strategy('session', 'cookie', 'try', {
    cookie: 'session',
    ttl: 1000 * 60 * 60,
    password: cookiePW,
    redirectTo: '/',
    redirectOnTry: false,
    isSecure: false
  })

  server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    password: cookiePW,
    clientId: process.env.TWITTER_KEY,
    clientSecret: process.env.TWITTER_SECRET,
    isSecure: false
  })

  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layouts',
    partialsPath: './views/partials',
    layout: true
  })

  server.route(routes)

  server.start(err => {
    if(err) {
      throw err
    }

    console.log('Server running at:', server.info.uri)
  })
})
