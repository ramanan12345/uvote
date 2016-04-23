'use strict'

const helpers = require('../../helpers')
const create = require('./createPoll')

const deletePoll = (request, reply) => {
  const client = request.pg.client
  const id = request.params.id
  const user = request.auth.credentials
  const queryString = 'DELETE FROM poll WHERE id = $1' 

  const query = client.query(queryString, [request.params.id], (err, result) => {
    if(err) {
      throw err
    }

    create(request, reply)
  })
}

module.exports = (request, reply, source, error) => {
  console.log(request.payload)
  const client = request.pg.client
  const user = request.auth.credentials
  const fields = helpers.validateFields(request.payload)
  const queryString = 'SELECT id FROM poll WHERE user_id = $1'


  if(error && error.isBoom && error.data.isJoi) {
    return reply.view('create', {
      fields: fields,
      user: user,
      createError: helpers.extractJoiErrors(error)
    }, {
      layout: 'createLayout'
    }).code(400)
  }

  const query = client.query(queryString, [user.id], (err, result) => {
    if(err) {
      throw err
    }

    if(!result.rowCount) {
      return reply({
        error: '401 unauthenticated user'
      }).code(401)
    }

    deletePoll(request, reply) 
  })
}

      
