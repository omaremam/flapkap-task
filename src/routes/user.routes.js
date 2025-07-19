const express = require('express');
const UserController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const { userCreateSchema, userUpdateSchema } = require('../validations/user.schema');

const router = express.Router();

router.post('/', validate(userCreateSchema), UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', validate(userUpdateSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
