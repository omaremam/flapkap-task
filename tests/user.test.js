const request = require('supertest');
const express = require('express');
const userRoutes = require('../src/routes/user.routes');
const { User, sequelize } = require('../src/models');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

const TEST_USER = {
  id: 12345,
  username: 'hardcodeduser',
  password: 'hashedpassword', // will be replaced with a real hash
  role: 'BUYER',
  deposit: 0
};

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Clean up and sync DB
  const hash = await bcrypt.hash('testpass', 10);
  await User.create({
    id: TEST_USER.id,
    username: TEST_USER.username,
    password: hash,
    role: TEST_USER.role,
    deposit: TEST_USER.deposit
  });
});

describe('User API', () => {
  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a user by id', async () => {
    const res = await request(app).get(`/api/users/${TEST_USER.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', TEST_USER.id);
  });

  it('should update a user', async () => {
    const res = await request(app)
      .put(`/api/users/${TEST_USER.id}`)
      .send({ deposit: 100 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('deposit', 100);
  });

  it('should delete a user', async () => {
    const res = await request(app).delete(`/api/users/${TEST_USER.id}`);
    expect(res.statusCode).toBe(204);
  });
});

afterAll(async () => {
  await sequelize.close();
});
