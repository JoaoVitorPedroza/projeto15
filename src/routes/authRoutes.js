const express = require('express');
const authController = require('../controllers/authController');
const { validateSignIn, validateSignUp } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/sign-up', validateSignUp, authController.signUp);
router.post('/sign-in', validateSignIn, authController.signIn);

module.exports = router;