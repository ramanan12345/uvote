const Joi = require('joi')
const re = /^[a-zA-Z0-9\s\.,'?!]*$/i

exports.create = {
  title: Joi.string().min(8).max(100).regex(re),
  option: Joi.array().items(Joi.string().min(1).max(30).regex(re)).min(2).unique()
}

exports['poll-id'] = {
  'poll-id': Joi.number().integer()
}

exports.user = {
  user: Joi.string().max(100)
}

exports.id = {
  id: Joi.number().integer()
}

    
