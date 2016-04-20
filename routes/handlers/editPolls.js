module.exports = (request, reply) => {
  if(!request.auth.isAuthenticated) {
    return reply.redirect('/')
  }
}
