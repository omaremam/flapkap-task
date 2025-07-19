const Joi = require('joi');

const userCreateSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('BUYER', 'SELLER').required(),
  deposit: Joi.number().integer().min(0)
});

const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  password: Joi.string().min(6),
  role: Joi.string().valid('BUYER', 'SELLER'),
  deposit: Joi.number().integer().min(0)
});

module.exports = { userCreateSchema, userUpdateSchema };
