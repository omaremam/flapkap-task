const ProductService = require("../services/product.service");

const ProductController = {
  async createProduct(req, res, next) {
    try {
      req.body.sellerId = req.user.id;
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      // Pass error to global error handler for stack trace logging
      next(error);
    }
  },

  async getProductById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      // Pass error to global error handler for stack trace logging
      next(error);
    }
  },

  async getAllProducts(req, res, next) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      // Pass error to global error handler for stack trace logging
      next(error);
    }
  },

  async updateProduct(req, res, next) {
    try {
      req.body.sellerId = req.user.id;
      const product = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      res.json(product);
    } catch (error) {
      // Pass error to global error handler for stack trace logging
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      await ProductService.deleteProduct(req.params.id, req.user.id);
      res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      // Pass error to global error handler for stack trace logging
      next(error);
    }
  },
};

module.exports = ProductController;
