const ProductService = require("../services/product.service");

const ProductController = {
  async createProduct(req, res) {
    try {
      req.body.sellerId = req.user.id;
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getProductById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      req.body.sellerId = req.user.id;
      const product = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      await ProductService.deleteProduct(req.params.id, req.user.id);
      res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = ProductController;
