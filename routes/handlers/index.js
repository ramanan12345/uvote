'use strict'

exports.create = (request, reply) => {
  if(request.route.method === 'get') {
    return reply.view('create', {
      isAuthenticated: true
    }, {
      layout: 'createLayout'
    })
  }

  console.log(request.payload)
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
