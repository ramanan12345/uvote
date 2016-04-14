const loginFields = require('./loginFields')
const Vision = require('vision')
const JWT = require('hapi-auth-jwt2')

const registerHandler = require('../handlers/register')
const loginHandler = require('../handlers/login')

const Register = {
  register: require('hapi-register'),
  options: {
    fields: loginFields,
    handler: registerHandler,
    fail_action_handler: registerHandler
  }
}

const Login = {
  register: require('hapi-login'),
  options: {
    fields: loginFields,
    handler: loginHandler,
    fail_action_handler: loginHandler
  }
}


const Postgres = {
  register: require('hapi-postgres-connection')
}

module.exports = [].concat(Vision, JWT, Register, Postgres, Login)
