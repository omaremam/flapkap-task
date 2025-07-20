const Joi = require('joi');

const depositSchema = Joi.object({
  amount: Joi.number().valid(5, 10, 20, 50, 100).required(),
});

const buySchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  amount: Joi.number().integer().positive().required(),
});

exports.depositValidation = (req, res, next) => {
  const { error } = depositSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

exports.buyValidation = (req, res, next) => {
  const { error } = buySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
