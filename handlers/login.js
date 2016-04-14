'use strict'

const validator = require('validator')
const bcrypt = require('bcrypt')

const handler = (request, reply, source, error) => {
  let email = validator.escape(request.payload.email)
  let password = validator.escape(request.payload.password)

  if(error) {
    return reply.view('login', {
      loginError: error.data.details[0].message,
      login: {
        email: email,
        password: password
      }
    })
  }

  let client = request.pg.client

  let validateQuery = 'SELECT * FROM people WHERE (email = $1)'
  let query = client.query(validateQuery, [email], (err, result) => {
    if(err) {
      console.error(err)
    }

    if(!result.rowCount) {
      return reply.view('login', {
        loginError: 'That email is not registered to an account',
        login: {
          email: email,
          password: password
        }
      })
    }

    let user = result.rows[0]

    bcrypt.compare(password, user.password, (err, res) => {
      if(!res) {
        return reply.view('login', {
          loginError: 'Incorrect Password',
          login: {
            email: email
          }
        })
      }
    })
  })
}

module.exports = handler

