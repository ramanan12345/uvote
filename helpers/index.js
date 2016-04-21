'use strict'

const validator = require('validator')

exports.extractJoiErrors = (error) => {
  return error.data.details.reduce((a, b) => {
    let message = b.message

    if(b.path.indexOf('option.') > -1) {
      message = 'Options are not allowed to be empty'
    }

    return a.concat(message)
  }, [])
}

exports.validateFields = (fields) => {
  return Object.keys(fields).reduce((a, key) => {
    if(Array.isArray(fields[key])) {
       a[key] = fields[key].map(field => {
        return validator.escape(field)
       })
    } else {
      a[key] = validator.escape(fields[key])
    }

    return a
  }, {})
}
