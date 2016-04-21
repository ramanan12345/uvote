'use strict'

module.exports = (request, reply) => {
  const getPolls = () => {
    const client = request.pg.client
    const queryString = 'select id, title from poll'
    const query = client.query(queryString, (err, result) => {
      if(err) {
        throw err
      }
      return reply.view('index', {
        isAuthenticated: request.auth.isAuthenticated,
        user: request.auth.credentials,
        polls: result.rows
      })
    })
  }

  getPolls()
}


