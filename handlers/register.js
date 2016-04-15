'use strict'

const validator = require('validator')
const bcrypt = require('bcrypt')
const Q = require('q')

const queryEmail = (client, email) => {
  let deferred = Q.defer()

  let checkQuery = 'Select * FROM people WHERE (email = $1)'

  client.query(checkQuery, [email], (err, result) => {
    if(err) {
      console.error(err)
    }

    deferred.resolve(result)
  })

  return deferred.promise
}

const checkUnique = (result) => {
  let deferred = Q.defer()

  if(result.rowCount > 0) {
    deferred.reject({
      error: 'An account is already registered with this email'
    })
  }

  deferred.resolve()

  return deferred.promise
}

const generateHash = (client, email, password) => {
  let deferred = Q.defer()

  bcrypt.genSalt(10, (err, salt) => {
    if(err) {
      console.error(err)
    }

    bcrypt.hash(password, salt, (err, hash) => {
      if(err) {
        console.error(err)
      }

      let query = 'INSERT INTO people (email, password) VALUES($1, $2)'

      client.query(query, [email, hash])

      deferred.resolve()
    })
  })
}


const handler = (request, reply, source, error) => {
  let email = validator.escape(request.payload.email)
  let password = validator.escape(request.payload.password)
  let client = request.pg.client

  if(error) {
    return reply.view('login', {
      registerError: error.data.details[0].message,
      register: {
        email: email,
        password: password
      }
    })
  }

  queryEmail(client, email) 
    .then(checkUnique)
    .then(() => {
      return generateHash(client, email, password)
    })
    .fail(e => {
      return reply.view('login', {
        registerError: e,
        register: {
          email: email
        }
      })
    })
}

module.exports = handler
