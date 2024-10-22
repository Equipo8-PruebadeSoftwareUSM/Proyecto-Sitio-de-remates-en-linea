const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, login, UserType } = require('../services/userService');
const authRoutes = require('../routes/authRoutes');

// Mock the userService functions
jest.mock('../services/userService');

// Mock the logger
jest.mock('../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Mock the config
jest.mock('../config/config', () => ({
  JWT_CONFIG: {
    SECRET: 'test-secret',
    EXPIRATION: '1h'
  }
}));

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        userId: 'user_123',
        email: 'test@example.com',
        userType: UserType.USER,
      };

      createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'User created successfully',
        user: mockUser,
      });
      expect(createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        userType: UserType.USER,
      });
    });

    it('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Email and password are required',
      });
    });

    it('should return 403 if trying to create an admin account', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'admin@example.com', password: 'password123', userType: UserType.ADMIN });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: 'Cannot create admin account through regular registration',
      });
    });

    it('should handle email already exists error', async () => {
      createUser.mockRejectedValue(new Error('Email already exists'));

      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'existing@example.com', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Email already exists',
      });
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        userId: 'user_123',
        email: 'test@example.com',
        userType: UserType.USER,
      };
      const mockToken = 'mock.jwt.token';

      login.mockResolvedValue({ token: mockToken, user: mockUser });

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: mockToken,
        user: mockUser,
      });
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Email and password are required',
      });
    });

    it('should return 401 for invalid credentials', async () => {
      login.mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid credentials',
      });
    });
  });

  // Add more test cases for other routes (create-admin, profile, logout) here
});