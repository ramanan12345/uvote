'use strict'

const Q = require('q')

const checkForUser = (client, user) => {
  const deferred = Q.defer()
  const query = 'SELECT * FROM people WHERE(id = $1)'

  client.query(query, [user.id], (err, result) => {
    if(err) {
      console.error(err)
    }

    if(!result.rowCount) {
      let query = 'INSERT INTO people (id, username, display_name) VALUES($1, $2, $3)'

      client.query(query, [user.id, user.username, user.displayName], (err, result) => {
        if(err) {
          console.error(err)
        }

        deferred.resolve()
      })
    }

    deferred.resolve()
  })

  return deferred.promise
}

module.exports = (request, reply) => {
  const client = request.pg.client

  if(request.auth.isAuthenticated) {
    let profile = request.auth.credentials.profile
    let user = {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName
    }

    checkForUser(client, user)
    .then(() => {
      request.cookieAuth.set(user)
      return reply.redirect('/')
    })
  }
}
