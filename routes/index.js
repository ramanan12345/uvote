'use strict'

const handlers = require('./handlers')
const createSchema = require('../validation/create')
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
  method: 'POST',
  path: '/poll/create',
  config: {
    auth: {
      mode: 'required'
    },
    validate: {
      payload: createSchema,
      failAction: handlers.create
    }
  },
  handler: handlers.create
},

{
  method: 'GET',
  path: '/poll/create',
  handler: handlers.create,
  config: {
    auth: {
      mode: 'required'
    }
  }
},

{
  method: ['GET', 'POST'],
  path: '/polls/edit',
  handler: handlers.editPolls,
  config: {
    auth: {
      mode: 'required'
    }
  }
},

{
  method: 'GET',
  path: '/polls/{user}',
  handler: handlers.userPolls
},

{
  method: 'GET',
  path: '/api/poll/{id}',
  handler: handlers.fetchPoll
},

{
  method: ['GET','POST'],
  path: '/poll/{id}',
  handler: handlers.userPoll
},

{
  method: 'GET',
  path: '/',
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
  handler: handlers.logout,
  config: {
    auth: {
      mode: 'required'
    }
  }
})
