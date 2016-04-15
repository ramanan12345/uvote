'use strict'

const validator = require('validator')
const bcrypt = require('bcrypt')
const Q = require('q')

const queryEmail = (client, email) => {
  let deferred = Q.defer()

  let validateQuery = 'SELECT * FROM people WHERE (email = $1)'
  let query = client.query(validateQuery, [email], (err, result) => {
    if(err) {
      console.error(err)
    }

    deferred.resolve(result)
  })

  return deferred.promise
}

const verifyEmail = (result) => {
  let deferred = Q.defer()

  if(!result.rowCount) {
    deferred.reject({
      error: 'This email is not registered to any account'
    })
  }

  deferred.resolve(result.rows[0])

  return deferred.promise
}

const verifyPassword = (password, user) => {
  let deferred = Q.defer()

  bcrypt.compare(password, user.password, (err, valid) => {
    if(err) {
      console.error(err)
    }

    if(!valid) {
      deferred.reject({
        error: 'Password was incorrect'
      })
    }

    deferred.resolve(valid)
  })

  return deferred.promise
}

const handler = (request, reply, source, error) => {
  let email = validator.escape(request.payload.email)
  let password = validator.escape(request.payload.password)
  let client = request.pg.client

  if(error) {
    return reply.view('login', {
      loginError: error.data.details[0].message,
      login: {
        email: email,
        password: password
      }
    })
  }

  queryEmail(client, email)
    .then(verifyEmail)
    .then((user) => {
      return verifyPassword(password, user)
    })
    .then((valid) => {
      console.log(valid)
    })
    .fail((e) => {
      return reply.view('login', {
        loginError: e.error,
        login: {
          email: email
        }
      })
    })
}

module.exports = handler

