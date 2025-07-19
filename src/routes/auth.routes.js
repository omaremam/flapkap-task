const express = require('express');
const AuthController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { userCreateSchema } = require('../validations/user.schema');
const { loginSchema } = require('../validations/auth.schema');

const router = express.Router();

router.post('/register', validate(userCreateSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

module.exports = router;
