const { Product } = require("../models");

class ProductService {
  static async createProduct(data) {
    return Product.create(data);
  }

  static async getProductById(id) {
    return Product.findByPk(id);
  }

  static async getAllProducts() {
    return Product.findAll();
  }

  static async updateProduct(id, data) {
    const product = await Product.findOne({
      where: {
        id,
        sellerId: data.sellerId,
      },
    });
    if (!product) throw new Error("Product not found");
    await product.update(data);
    return product;
  }

  static async deleteProduct(id, sellerId) {
    const product = await Product.findOne({
      where: {
        id,
        sellerId,
      },
    });
    if (!product) throw new Error("Product not found");
    await product.destroy();
  }
}

module.exports = ProductService;
