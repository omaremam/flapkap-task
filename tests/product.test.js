const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Product, sequelize } = require('../src/models');
const productRoutes = require('../src/routes/product.routes');
const authRoutes = require('../src/routes/auth.routes');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

let sellerToken;
let seller;
let createdProduct;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Create a seller user and get a token
  const password = await bcrypt.hash('testpass', 10);
  seller = await User.create({
    username: `seller_${Date.now()}_${Math.random()}`,
    password,
    role: 'SELLER',
    deposit: 0
  });
  sellerToken = jwt.sign({ id: seller.id, role: seller.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product API', () => {
  it('should create a product', async () => {
    const productData = {
      productName: `TestProduct_${Date.now()}_${Math.random()}`,
      amountAvailable: 10,
      cost: 50
    };
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(productData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('productName', productData.productName);
    createdProduct = res.body;
  });

  it('should get all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a product by id', async () => {
    const res = await request(app)
      .get(`/api/products/${createdProduct.id}`)
      .set('Authorization', `Bearer ${sellerToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdProduct.id);
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put(`/api/products/${createdProduct.id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ amountAvailable: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('amountAvailable', 20);
  });

  it('should delete a product', async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProduct.id}`)
      .set('Authorization', `Bearer ${sellerToken}`);
    expect(res.statusCode).toBe(200);
    const deleted = await Product.findByPk(createdProduct.id);
    expect(deleted).toBeNull();
  });
});
