const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const { User, sequelize } = require('../src/models');
const userRoutes = require('../src/routes/user.routes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

let createdUser;
let uniqueUsername;
let testData = []; // Track test data for cleanup

beforeEach(async () => {
  uniqueUsername = `testuser_${Date.now()}_${Math.random()}`;
  const hashedPassword = await bcrypt.hash('testpass', 10);
  createdUser = await User.create({
    username: uniqueUsername,
    password: hashedPassword,
    role: 'BUYER',
    deposit: 0
  });
  testData.push({ type: 'user', id: createdUser.id });
});

afterEach(async () => {
  // Clean up only test data
  for (const item of testData) {
    if (item.type === 'user') {
      await User.destroy({ where: { id: item.id } });
    }
  }
  testData = []; // Reset for next test
});

afterAll(async () => {
  await sequelize.close();
});

describe('User API', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return a user by ID', async () => {
    const res = await request(app).get(`/api/users/${createdUser.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdUser.id);
    expect(res.body).toHaveProperty('username', uniqueUsername);
  });

  it('should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${createdUser.id}`)
      .send({ deposit: 100 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('deposit', 100);

    const updatedUser = await User.findByPk(createdUser.id);
    expect(updatedUser.deposit).toBe(100);
  });

  it('should delete a user', async () => {
    const res = await request(app).delete(`/api/users/${createdUser.id}`);
    expect(res.statusCode).toBe(204);

    const deleted = await User.findByPk(createdUser.id);
    expect(deleted).toBeNull();
  });
});
