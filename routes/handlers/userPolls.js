'use strict'

const getPolls = require('../../helpers').getPolls

module.exports = (request, reply) => {
    const user = request.auth.credentials || { username: request.params.user }
    const client = request.pg.client
    const queryString = 'SELECT poll_id, title FROM poll INNER JOIN people ON (people.username = $1) AND (people.id = poll.user_id)'

    getPolls(client, queryString, [request.params.user])
    .then(rows => {
      return reply.view('userPolls', {
        isAuthenticated: request.auth.isAuthenticated,
        user: user,
        polls: rows
      })
    })
    .fail(err => {
      console.error(err)

      if(err.empty) {
        return reply.view('userPolls', {
          isAuthenticated: request.auth.isAuthenticated,
          user: user,
          empty: true
        }).code(400)
      }
    })
}





