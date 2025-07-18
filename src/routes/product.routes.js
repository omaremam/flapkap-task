const express = require('express');
const ProductController = require('../controllers/product.controller');
const authRole = require('../middlewares/authRole.middleware');

const router = express.Router();

router.get('/', authRole(), ProductController.getAllProducts);
router.get('/:id', authRole(), ProductController.getProductById);
router.post('/', authRole({ roles: ['seller'] }), ProductController.createProduct);
router.put('/:id', authRole({ roles: ['seller'] }), ProductController.updateProduct);
router.delete('/:id', authRole({ roles: ['seller'] }), ProductController.deleteProduct);

module.exports = router;
