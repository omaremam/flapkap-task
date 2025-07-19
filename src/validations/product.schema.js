const Joi = require('joi');

const productCreateSchema = Joi.object({
  productName: Joi.string().min(2).max(100).required(),
  amountAvailable: Joi.number().integer().min(0).required(),
  cost: Joi.number().integer().min(0).required(),
});

const productUpdateSchema = Joi.object({
  productName: Joi.string().min(2).max(100),
  amountAvailable: Joi.number().integer().min(0),
  cost: Joi.number().integer().min(0),
});

module.exports = { productCreateSchema, productUpdateSchema };
