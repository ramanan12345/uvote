const Joi = require('joi')

module.exports = {
  email: Joi.string().email().required().max(254),
  password: Joi.string().required().min(8).max(300),
  username: Joi.string().optional().min(5).max(15)
}
