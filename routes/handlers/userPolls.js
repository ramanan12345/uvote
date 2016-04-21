'use strict'

module.exports = (request, reply) => {
  const getPolls = (client, queryString, option) => {
    const query = client.query(queryString, option, (err, result) => {
      if(err) {
        throw err
      }

      if(!result.rowCount) {
        return reply.view('userPolls', {
          isAuthenticated: request.auth.isAuthenticated,
          user: request.auth.credentials,
          username: username,
          empty: true
        }).code(400)
      } else {
        return reply.view('userPolls', {
          isAuthenticated: request.auth.isAuthenticated,
          user: request.auth.credentials,
          username: username,
          polls: result.rows
        })
      }
    })
  }

  const client = request.pg.client
  const username = request.params.user
  const queryString = 'SELECT username, poll.id, title FROM poll JOIN people ON people.username = $1 AND people.id = poll.user_id'

  getPolls(client, queryString, [username])
}
