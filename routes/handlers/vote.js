'use strict'

const aguid = require('aguid')
const userPoll = require('./userPoll')

module.exports = (request, reply) => {
  const updateVote = (client, options) => {
    const queryString = 'UPDATE option SET rating = rating + 1 WHERE' +
      ' option.poll_id = $1 AND value = $2'

    const query = client.query(queryString, [request.params.id, request.payload.option])

    query.on('error', err => {
      throw err
    })

    query.on('end', () => {
      return reply.redirect('/poll/' + request.params.id)
    })
  }

  const createVoter = (client, options) => {
    const queryString = 'INSERT INTO votes (id, poll_id) VALUES($1, $2)'
    const query = client.query(queryString, options)

    query.on('error', err => {
      throw err
    })

    query.on('end', () => {
      updateVote(client, options)
    })
  }

  const checkId = (client, queryString, options) => {
    const query = client.query(queryString, options, (err, result) => {
      if(err) {
        throw err
      }

      if(!result.rowCount) {
        createVoter(client, options)
      } else {
        return reply.redirect('/poll/' + request.params.id)
      }
    })
  }

  const client = request.pg.client
  const poll_id = request.params.id 
  const queryString = 'SELECT * FROM votes WHERE id = $1 AND poll_id = $2'
  const id = request.auth.isAuthenticated ?
    request.auth.credentials.id : aguid(request.headers['user-agent'])

  checkId(client, queryString, [id, poll_id])
}

