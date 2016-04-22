'use strict'

const post = require('./vote')

const reducePoll = (title, id, rows) => {
  return rows.reduce((poll, row) => {
    poll.options = poll.options.concat({
      value: row.value,
      rating: row.rating
    })
    return poll
  },{ title: title, id: id, options: [] })
}

module.exports = (request, reply) => {
  if(request.route.method === 'post') {
    post(request, reply)
  } else {
    const fetchPoll = (client, queryString, options) => {
      const query = client.query(queryString, options, (err, result) => {
        if(err) {
          throw err
        }

        if(!result.rowCount) {
          return reply({
            statusCode: '404',
            error: 'No Polls match that ID'
          }).code(404)
        }

        const poll = reducePoll(result.rows[0]['title'], result.rows[0]['id'], result.rows)

        return reply.view('userPoll', {
          isAuthenticated: request.auth.isAuthenticated,
          user: request.auth.credentials,
          poll: poll
        }, {
          layout: 'pollChartLayout'
        })
      })
    }

    const queryString = 'SELECT title, value, rating, username, poll.id FROM people JOIN' +
      ' poll ON poll.id = $1 AND poll.user_id = people.id JOIN' +
      ' option ON poll.id = option.poll_id'

    fetchPoll(request.pg.client, queryString, [request.params.id])

  }
}
