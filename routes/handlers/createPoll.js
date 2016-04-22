'use strict'

const Q = require('q')
const validator = require('validator')
const helpers = require('../../helpers')

const createPoll = (client, title, user) => {
  const deferred = Q.defer()
  const query = 'INSERT INTO poll (title, user_id) VALUES($1, $2) returning poll.id'

  client.query(query, [title, user.id], (err, result) => {
    if(err) {
      deferred.reject(err)
    }

    deferred.resolve(result.rows[0]['id'])
  })

  return deferred.promise
}

const queryOption = (client, option, id) => {
  const deferred = Q.defer()

  const query = 'INSERT INTO option (value, poll_id) VALUES($1, $2)'

  client.query(query, [option, id], (err, result) => {
    if(err) {
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

module.exports = (request, reply, source, error) => {
  const user = request.auth.credentials

  if(request.route.method === 'get') {
    const defaultFields = {
      title: '',
      option: ['','']
    }

    return reply.view('create', {
      fields: defaultFields,
      user: user
    }, {
      layout: 'createLayout'
    })
  }

  const fields = helpers.validateFields(request.payload)
  const client = request.pg.client

  if(error && error.isBoom && error.data.isJoi) {
    return reply.view('create', {
      fields: fields,
      user: user,
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
  .fail(err => {
    console.log('path :', request.route.path)
    console.error(err)
  })
}

