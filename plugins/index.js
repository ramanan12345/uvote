const loginFields = require('./loginFields')
const registerHandler = require('../handlers/register')
const loginHandler = require('../handlers/login')

const JWT = {
  register: require('hapi-auth-jwt2')
}

const Vision = {
  register: require('vision')
}

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
