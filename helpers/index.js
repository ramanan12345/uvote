'use strict'

const xss = require('xss')

exports.extractJoiErrors = (error) => {
  return error.data.details.reduce((a, b) => {
    let message = b.message

    if(b.path.indexOf('option.') > -1) {
      console.log(b)
      message = 'Options are not allowed to be empty'
    }

    return a.concat(message)
  }, [])
}

exports.validateFields = (fields) => {
  return Object.keys(fields).reduce((a, key) => {
    if(Array.isArray(fields[key])) {
       a[key] = fields[key].map(field => {
        return xss(field)
       })
    } else {
      a[key] = xss(fields[key])
    }

    return a
  }, {})
}
