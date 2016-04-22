const pollFormatter = (rows) => {
  const poll = {
    title: rows[0]['title'],
    id: rows[0]['id'],
    options: []
  }

  return rows.reduce((poll, row) => {
    poll.options = poll.options.concat({
      value: row.value,
      rating: row.rating
    })
    return poll
  }, poll)
}

module.exports = (request, reply) => {
  const client = request.pg.client
  const queryString = 'SELECT * FROM option JOIN poll ON poll.id = $1' +
  ' AND poll.id = option.poll_id'

  const query = client.query(queryString, [request.params.id], (err, result) => {
    if(err) {
      throw err
    }

    if(!result.rowCount) {
      return reply({
        statusCode: '404',
        error: 'No Polls match that ID'
      }).code(404)
    }

    return reply({
      poll: pollFormatter(result.rows)
    })
  })
}
