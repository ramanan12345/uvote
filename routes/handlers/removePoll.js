'use strict'

const deletePoll = (request, reply) => {
  const client = request.pg.client
  const id = request.params.id
  const queryString = 'DELETE FROM poll WHERE id = $1'

  client.query(queryString, [id], (err, result) => {
    if(err) {
      throw err
    }

    return reply.redirect('/')
  })
}

module.exports = (request, reply) => {
  const client = request.pg.client
  const user = request.auth.credentials
  const pollId = request.params.id
  const queryString = 'SELECT id FROM poll WHERE user_id = $1 AND id = $2'

  const query = client.query(queryString, [user.id, pollId], (err, result) => {
    if(err) {
      throw err
    }

    if(!result.rowCount) {
      return reply({
        error: '401 you do not have access'
      }).code(401)
    }

    deletePoll(request, reply)
  })
}
    


