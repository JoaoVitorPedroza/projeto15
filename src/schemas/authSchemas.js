const Joi = require('joi');

// Schema para a rota de registro (sign-up)
const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

// Schema para a rota de login (sign-in)
const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { signUpSchema, signInSchema };
