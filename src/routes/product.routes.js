const express = require('express');
const ProductController = require('../controllers/product.controller');
const authRole = require('../middlewares/authRole.middleware');
const validate = require('../middlewares/validate.middleware');
const { productCreateSchema, productUpdateSchema } = require('../validations/product.schema');

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', authRole({ roles: ['SELLER'] }), validate(productCreateSchema), ProductController.createProduct);
router.put('/:id', authRole({ roles: ['SELLER'] }), validate(productUpdateSchema), ProductController.updateProduct);
router.delete('/:id', authRole({ roles: ['SELLER'] }), ProductController.deleteProduct);

module.exports = router;
