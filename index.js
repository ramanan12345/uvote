const Hapi = require('hapi')
const Handlebars = require('handlebars')

const server = new Hapi.Server()
const PORT = process.env.PORT || 9966

const plugins = require('./plugins')

server.connection({ port: PORT})

server.register(plugins, err => {
  if(err) {
    throw err
  }

  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layouts',
    partialsPath: './views/partials',
    layout: true
  })

  /* static files */

  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'assets'
      }
    }
  })

  server.route({
    method: 'GET', 
    path: '/',
    handler: (request, reply) => {
      return reply.view('index')
    }
  })


  server.start(err => {
    if(err) {
      throw err
    }

    console.log('Server running at:', server.info.uri)
  })
})




