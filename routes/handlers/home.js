'use strict'

const getPolls = require('../../helpers').getPolls

module.exports = (request, reply) => {
  const client = request.pg.client
  const queryString = 'SELECT poll_id, title FROM poll'

  getPolls(client, queryString)
  .then(rows => {
    return reply.view('index', {
      isAuthenticated: request.auth.isAuthenticated,
      user: request.auth.credentials,
      polls: rows
    })
  })
}
