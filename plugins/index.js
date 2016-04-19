const Vision = {
  register: require('vision')
}

const Inert = {
  register: require('inert')
}

const HPC = {
  register: require('hapi-postgres-connection')
}

const HapiAuthCookie = {
  register: require('hapi-auth-cookie')
}

const Bell = {
  register: require('bell')
}

module.exports = [].concat(Vision, Inert, HapiAuthCookie, Bell, HPC)
