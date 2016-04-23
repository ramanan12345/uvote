'use strict'

const handlers = require('./handlers')
const validation = require('../validation')
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
      payload: validation.create,
      failAction: handlers.create
    }
  },
  handler: handlers.create
},

{
  method: 'POST',
  path: '/polls/edit/{id}',
  config: {
    auth: {
      mode: 'required'
    }, 
    validate: {
      params: validation.id,
      payload: validation.create,
      failAction: handlers.edit
    }
  },
  handler: handlers.edit
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
    validate: {
      params: validation['poll-id']
    },
    auth: {
      mode: 'required'
    }
  }
},

{
  method: 'GET',
  path: '/polls/{user}',
  config: {
    validate: {
      params: validation.user
    }
  },
  handler: handlers.userPolls
},

{
  method: 'GET',
  path: '/api/poll/{id}',
  config: {
    validate: {
      params: validation.id
    }
  },
  handler: handlers.fetchPoll
},

{
  method: ['GET','POST'],
  path: '/poll/{id}',
  config: {
    validate: {
      params: validation.id
    }
  },
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
  path: '/polls/delete/{id}',
  config: {
    auth: {
      mode: 'required'
    },
    validate: {
      params: validation.id
    }
  },
  handler: handlers.remove
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
