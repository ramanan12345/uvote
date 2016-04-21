const Joi = require('joi')
const re = /^[a-zA-Z0-9\s\.,?!]*$/i

const schema = {
  title: Joi.string().min(8).max(100).regex(re),
  option: Joi.array().items(Joi.string().min(1).max(30).regex(re)).min(2).unique()
}

module.exports = schema
    
