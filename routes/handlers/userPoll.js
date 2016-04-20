const getPolls = require('../../helpers').getPolls

const reducePoll = (title, rows) => {
  return rows.reduce((poll, row) => {
    poll.options = poll.options.concat({
      value: row.value,
      rating: row.rating
    })
    return poll
  },{ title: title, options: [] })
}

module.exports = (request, reply) => {
  const queryString = 'SELECT title, value, rating, username, poll.id FROM people JOIN' +
    ' poll ON poll.id = $1 AND poll.user_id = people.id JOIN' +
    ' option ON poll.id = option.poll_id'

  getPolls(request.pg.client, queryString, [request.params.id])
  .then(rows => {
    const poll = reducePoll(rows[0]['title'], rows)
    return reply.view('userPoll', {
      isAuthenticated: request.auth.isAuthenticated,
      poll: poll
    })
  })
  .fail(err => {
    return reply({
      error: err
    })
  })
}
