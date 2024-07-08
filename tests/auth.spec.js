const request = require('supertest');
const app = require('../src/app');
const { sequelize, User, Organisation } = require('../src/model');

describe('Authentication End-to-End Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /auth/register', () => {
    it('Should Register User Successfully with Default Organisation', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '1234567890'
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Registration successful');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toEqual({
        userId: expect.any(String),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890'
      });

      // Check if default organisation was created
      const user = await User.findOne({ where: { email: 'john@example.com' } });
      const organisations = await user.getOrganisations();
      expect(organisations).toHaveLength(1);
      expect(organisations[0].name).toBe("John's Organisation");
    });

    it('Should Fail If Required Fields Are Missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          lastName: 'Doe',
          email: 'jane@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContainEqual({
        field: 'firstName',
        message: expect.any(String)
      });
    });

    it('Should Fail if there\'s Duplicate Email', async () => {
      // First, register a user
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          password: 'password123',
          phone: '0987654321'
        });

      // Try to register again with the same email
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          password: 'anotherpassword',
          phone: '1122334455'
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContainEqual({
        field: 'email',
        message: 'Email already exists'
      });
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      // Create a user for login tests
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
          phone: '1231231234'
        });
    });

    it('Should Log the user in successfully', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toEqual({
        userId: expect.any(String),
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1231231234'
      });
    });

    it('Should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('Bad request');
      expect(response.body.message).toBe('Authentication failed');
      expect(response.body.statusCode).toBe(401);
    });
  });
});