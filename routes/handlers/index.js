'use strict'

const validator = require('validator')
const helpers = require('../../helpers')

exports.create = require('./createPoll')

exports.home = (request, reply) => {
  if(request.auth.isAuthenticated) {
    return reply.view('index', {
      isAuthenticated: true
    })
  }

  return reply.view('index', {
    isAuthenticated: false
  })
}

exports.twitter = require('./twitter')

exports.logout = (request, reply) => {
  request.cookieAuth.clear()
  return reply.redirect('/')
}
