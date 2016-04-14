'use strict'

const validator = require('validator')
const bcrypt = require('bcrypt')

const handler = (request, reply, source, error) => {
  let email = validator.escape(request.payload.email)
  let password = validator.escape(request.payload.password)

  if(error) {
    return reply.view('login', {
      registerError: error.data.details[0].message,
      register: {
        email: email,
        password: password
      }
    })
  }

  let client = request.pg.client

  let checkQuery = 'Select * FROM people WHERE (email = $1)'

  client.query(checkQuery, [email], (err, result) => {
    if(err) {
      console.error(err)
    }

    if(result.rowCount > 0) {
      return reply.view('login', {
        registerError: 'This email is already registered to an account',
        register: {
          email: email,
          password: password
        }
      })
    }

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
      })
    })
  })
}

module.exports = handler
