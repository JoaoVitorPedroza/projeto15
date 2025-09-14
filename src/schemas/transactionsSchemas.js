const Joi = require('joi');

const transactionSchema = Joi.object({
  value: Joi.number().positive().required(),
  description: Joi.string().required(),
  type: Joi.string().valid('deposit', 'withdraw').required(),
});

module.exports = { transactionSchema };
