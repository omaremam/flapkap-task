const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Product, sequelize } = require('../src/models');
const vendingRoutes = require('../src/routes/vending.routes');
const authRoutes = require('../src/routes/auth.routes');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/api/vending', vendingRoutes);
app.use('/api/auth', authRoutes);

let buyerToken;
let sellerToken;
let buyer;
let seller;
let product;
let testData = [];

beforeAll(async () => {
  await sequelize.sync();

  const buyerPassword = await bcrypt.hash('testpass', 10);
  buyer = await User.create({
    username: `buyer_${Date.now()}_${Math.random()}`,
    password: buyerPassword,
    role: 'BUYER',
    deposit: 0
  });
  testData.push({ type: 'user', id: buyer.id });
  buyerToken = jwt.sign({ id: buyer.id, role: buyer.role }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1d' });

  const sellerPassword = await bcrypt.hash('testpass', 10);
  seller = await User.create({
    username: `seller_${Date.now()}_${Math.random()}`,
    password: sellerPassword,
    role: 'SELLER',
    deposit: 0
  });
  testData.push({ type: 'user', id: seller.id });
  sellerToken = jwt.sign({ id: seller.id, role: seller.role }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1d' });

  product = await Product.create({
    productName: `TestProduct_${Date.now()}_${Math.random()}`,
    amountAvailable: 10,
    cost: 50,
    sellerId: seller.id
  });
  testData.push({ type: 'product', id: product.id });
});

afterAll(async () => {
  for (const item of testData) {
    if (item.type === 'user') {
      await User.destroy({ where: { id: item.id } });
    } else if (item.type === 'product') {
      await Product.destroy({ where: { id: item.id } });
    }
  }
  await sequelize.close();
});

describe('Vending API - Deposit', () => {
  describe('POST /api/vending/deposit', () => {
    it('should deposit money successfully', async () => {
      const res = await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 100 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('balance', 100);

      const updatedUser = await User.findByPk(buyer.id);
      expect(updatedUser.deposit).toBe(100);
    });

    it('should accumulate deposits correctly', async () => {
      await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 50 });

      const res = await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 20 });

      expect(res.statusCode).toBe(200);
      expect(res.body.balance).toBe(170);

      const updatedUser = await User.findByPk(buyer.id);
      expect(updatedUser.deposit).toBe(170);
    });

    it('should reject invalid deposit amounts', async () => {
      const res = await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 15 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject non-BUYER users', async () => {
      const res = await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ amount: 100 });

      expect(res.statusCode).toBe(403);
    });

    it('should reject requests without authentication', async () => {
      const res = await request(app)
        .post('/api/vending/deposit')
        .send({ amount: 100 });

      expect(res.statusCode).toBe(401);
    });

    it('should reject requests without amount', async () => {
      const res = await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });
});

describe('Vending API - Buy', () => {
  beforeEach(async () => {
    await User.update({ deposit: 0 }, { where: { id: buyer.id } });
    await Product.update({ amountAvailable: 10 }, { where: { id: product.id } });
  });

  describe('POST /api/vending/buy', () => {
    it('should buy product successfully', async () => {
      await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 100 });

      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: product.id, amount: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('productId', product.id);
      expect(res.body).toHaveProperty('amount', 1);
      expect(res.body).toHaveProperty('totalSpent', 50);
      expect(res.body).toHaveProperty('change', 50);
      expect(res.body).toHaveProperty('productName', product.productName);

      const updatedProduct = await Product.findByPk(product.id);
      expect(updatedProduct.amountAvailable).toBe(9);

      const updatedUser = await User.findByPk(buyer.id);
      expect(updatedUser.deposit).toBe(50);
    });

    it('should reject purchase with insufficient funds', async () => {
      await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 20 });

      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: product.id, amount: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Insufficient funds');
    });

    it('should reject purchase with insufficient stock', async () => {
      await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 1000 });

      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: product.id, amount: 15 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Insufficient stock');
    });

    it('should reject purchase of non-existent product', async () => {
      await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 100 });

      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: 99999, amount: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Product not found');
    });

    it('should reject non-BUYER users', async () => {
      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ productId: product.id, amount: 1 });

      expect(res.statusCode).toBe(403);
    });

    it('should reject requests without authentication', async () => {
      const res = await request(app)
        .post('/api/vending/buy')
        .send({ productId: product.id, amount: 1 });

      expect(res.statusCode).toBe(401);
    });

    it('should reject invalid productId', async () => {
      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: 'invalid', amount: 1 });

      expect(res.statusCode).toBe(400);
    });

    it('should reject invalid amount', async () => {
      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: product.id, amount: -1 });

      expect(res.statusCode).toBe(400);
    });

    it('should reject purchase when change cannot be made with available denominations', async () => {
      const expensiveProduct = await Product.create({
        productName: `ExpensiveProduct_${Date.now()}_${Math.random()}`,
        amountAvailable: 10,
        cost: 23,
        sellerId: seller.id
      });
      testData.push({ type: 'product', id: expensiveProduct.id });

      await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 100 });

      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: expensiveProduct.id, amount: 1 });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Cannot make change');
      expect(res.body.error).toContain('77');

      const updatedUser = await User.findByPk(buyer.id);
      expect(updatedUser.deposit).toBe(100);

      const updatedProduct = await Product.findByPk(expensiveProduct.id);
      expect(updatedProduct.amountAvailable).toBe(10);
    });

    it('should allow purchase when change can be made with available denominations', async () => {
      const cheapProduct = await Product.create({
        productName: `CheapProduct_${Date.now()}_${Math.random()}`,
        amountAvailable: 10,
        cost: 30,
        sellerId: seller.id
      });
      testData.push({ type: 'product', id: cheapProduct.id });

      await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 100 });

      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: cheapProduct.id, amount: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body.totalSpent).toBe(30);
      expect(res.body.change).toBe(70);

      const updatedUser = await User.findByPk(buyer.id);
      expect(updatedUser.deposit).toBe(70);

      const updatedProduct = await Product.findByPk(cheapProduct.id);
      expect(updatedProduct.amountAvailable).toBe(9);
    });

    it('should allow purchase with exact amount (no change needed)', async () => {
      const exactProduct = await Product.create({
        productName: `ExactProduct_${Date.now()}_${Math.random()}`,
        amountAvailable: 10,
        cost: 100,
        sellerId: seller.id
      });
      testData.push({ type: 'product', id: exactProduct.id });

      await request(app)
        .post('/api/vending/deposit')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ amount: 100 });

      const res = await request(app)
        .post('/api/vending/buy')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ productId: exactProduct.id, amount: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body.totalSpent).toBe(100);
      expect(res.body.change).toBe(0);

      const updatedUser = await User.findByPk(buyer.id);
      expect(updatedUser.deposit).toBe(0);

      const updatedProduct = await Product.findByPk(exactProduct.id);
      expect(updatedProduct.amountAvailable).toBe(9);
    });
  });
});
