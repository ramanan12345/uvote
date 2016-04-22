'use strict'

module.exports = (request, reply) => {
  switch(request.route.method) {
    case 'get':
      handleGet(request, reply)
    break;
    case 'post':
      handlePost(request,reply)
    break;
    default: reply({ error: '404' }).code(404)
  }
}

const formatRows = (rows) => {
  return rows.reduce((polls, current) => {
    let poll = polls[current.pollid] = polls[current.pollid] || {}
    poll.id = poll.id || current.pollid
    poll.title = poll.title || current.title
    poll.options = poll.options ?
      poll.options.concat(current.value) :
      [current.value]

    return polls
  }, {})
}

const handlePost = (request, reply) => {
  const id = request.payload['poll-id']
  const userId = request.auth.credentials.id
  const client = request.pg.client
  const queryString = 'SELECT poll.id as pollId, people.id, poll.title, option.value FROM people JOIN option ON people.id = $2 AND option.poll_id = $1 JOIN poll ON poll.id = $1'

  const query = client.query(queryString, [id, userId], (err, result) => {
    if(err) {
      throw err
    }

    if(!result.rowCount) {
      return reply.redirect('/')
    }


    return reply.view('editPoll', {
      user: request.auth.credentials,
      fields: formatRows(result.rows)[id]
    }, { layout: 'createLayout' })

  })
}

const handleGet = (request, reply) => {
  const user = request.auth.credentials
  const client = request.pg.client
  const queryString = 'SELECT poll.id as pollId, people.id, poll.title, option.value FROM people ' +
    'JOIN poll ON people.id = $1 AND poll.user_id = people.id ' +
    'JOIN option ON option.poll_id = poll.id'

  const query = client.query(queryString, [user.id], (err, result) => {
    if(err) {
      throw err
    }

    return reply.view('editPolls', {
      isAuthenticated: request.auth.isAuthenticated,
      user: user,
      polls: formatRows(result.rows)
    })
  })
}
