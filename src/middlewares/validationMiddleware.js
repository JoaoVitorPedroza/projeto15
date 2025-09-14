const Joi = require('joi');

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(422).send(messages);
    }
    next();
  };
}

const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const transactionSchema = Joi.object({
  description: Joi.string().required(),
  amount: Joi.number().required(),
  type: Joi.string().valid('income', 'expense').required(),
  date: Joi.date().required(),
});

const validateSignUp = validateBody(signUpSchema);
const validateSignIn = validateBody(signInSchema);
const validateTransaction = validateBody(transactionSchema);

module.exports = {
  validateSignUp,
  validateSignIn,
  validateTransaction,
};
