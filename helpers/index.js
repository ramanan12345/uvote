'use strict'

const Q = require('q')
const validator = require('validator')

exports.getPolls = (client, queryString, options) => {
  const deferred = Q.defer()
  const query = client.query(queryString, (options || []))

  let rows = []

  query.on('row', row => {
    rows.push(row)
  })

  query.on('error', err => {
    deferred.reject(err)
  })

  query.on('end', () => {
    return rows.length ?
      deferred.resolve(rows) :
      deferred.reject({ empty: true })
  })

  return deferred.promise
}

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
