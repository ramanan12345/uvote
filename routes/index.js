'use strict'

const handlers = require('./handlers')
const routes = []

module.exports = routes.concat(
{
  method: 'GET',
  path: '/assets/{param*}',
  handler: {
    directory: {
      path: 'assets'
    }
  }
},

{
  method: ['GET', 'POST'],
  path: '/poll/create',
  config: {
    auth: 'session',
  },
  handler: handlers.create
},

{
  method: 'GET',
  path: '/',
  config: {
    auth: {
      strategy: 'session',
      mode: 'try'
    }
  },
  handler: handlers.home
},

{
  method: '*',
  path: '/twitter',
  config: {
    auth: 'twitter',
    handler: handlers.twitter
  }
},

{
  method: 'GET',
  path: '/logout',
  handler: handlers.logout
})
