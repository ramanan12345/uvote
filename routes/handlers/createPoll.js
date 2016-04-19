'use strict'

const Q = require('q')
const validator = require('validator')
const helpers = require('../../helpers')

const createPoll = (client, title, user) => {
  const deferred = Q.defer()
  const query = 'INSERT INTO poll (title, user_id) VALUES($1, $2) returning poll_id'

  client.query(query, [title, user.id], (err, result) => {
    if(err) {
      console.error(err, 'createPoll')
      deferred.reject(err)
    }

    deferred.resolve(result.rows[0]['poll_id'])
  })

  return deferred.promise
}

const queryOption = (client, option, id) => {
  const deferred = Q.defer()

  const query = 'INSERT INTO option (value, poll_id) VALUES($1, $2)'

  client.query(query, [option, id], (err, result) => {
    if(err) {
      console.error(err, 'queryOption')
      deffered.reject(err)
    }

    deferred.resolve()
  })

  return deferred.promise
}

const createOptions = (client, options, id) => {
  return options.map(option => {
    return queryOption(client, option, id)
  })
}

module.exports = (request, reply, soure, error) => {
  if(request.route.method === 'get') {
    const defaultFields = {
      title: '',
      option: ['','']
    }

    return reply.view('create', {
      isAuthenticated: true,
      fields: defaultFields
    }, {
      layout: 'createLayout'
    })
  }

  const fields = helpers.validateFields(request.payload)
  const client = request.pg.client
  const user = request.auth.credentials

  if(error && error.isBoom && error.data.isJoi) {
    return reply.view('create', {
      isAuthenticated: true,
      fields: fields,
      createError: helpers.extractJoiErrors(error)
    }, {
      layout: 'createLayout'
    }).code(400)
  }

  createPoll(client, fields.title, user)
  .then(id => {
    return Q.all(createOptions(client, fields.option, id))
  })
  .then(() => {
    return reply.redirect('/')
  })
}

