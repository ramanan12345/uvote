'use strict'

const validator = require('validator')
const helpers = require('../../helpers')

exports.create = (request, reply, soure, error) => {
  const defaultFields = {
    title: '',
    option: ['','']
  }

  console.log(request.payload)

  if(request.route.method === 'get') {
    return reply.view('create', {
      isAuthenticated: true,
      fields: defaultFields
    }, {
      layout: 'createLayout'
    })
  }

  if(error && error.isBoom && error.data.isJoi) {
    let fields = helpers.validateFields(request.payload)

    return reply.view('create', {
      isAuthenticated: true,
      fields: fields,
      createError: helpers.extractJoiErrors(error)
    }, {
      layout: 'createLayout'
    }).code(400)
  }

}

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

exports.twitter = (request, reply) => {
  if(request.auth.isAuthenticated) {
    let profile = request.auth.credentials.profile
    let user = {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName
    }

    request.cookieAuth.set(user)
  }

  return reply.redirect('/')
}

exports.logout = (request, reply) => {
  request.cookieAuth.clear()
  return reply.redirect('/')
}
