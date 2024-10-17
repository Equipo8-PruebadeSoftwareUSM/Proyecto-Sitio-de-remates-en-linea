const { docClient, TABLES, JWT_CONFIG } = require('../config/config');
const { PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

const UserType = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};
async function createAdminAccount(email, password) {
  try {
    const response = await fetch('/api/auth/create-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create admin account');
    }

    const data = await response.json();
    console.log('Admin account created:', data);
    // Handle successful admin creation (e.g., show a success message)
  } catch (error) {
    console.error('Error creating admin account:', error);
    alert(error.message);
  }
}

async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const user = {
    userId: `user_${Date.now()}`,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    userType: userData.userType || UserType.USER,
    createdAt: new Date().toISOString()
  };

  const params = {
    TableName: TABLES.USERS,
    Item: user,
    ConditionExpression: "attribute_not_exists(email)"
  };

  try {
    await docClient.send(new PutCommand(params));
    logger.info(`User created: ${user.email}`);
    return { ...user, password: undefined };
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      throw new Error('Email already exists');
    }
    logger.error('Error creating user', { error });
    throw error;
  }
}

async function getUserByEmail(email) {
  const params = {
    TableName: TABLES.USERS,
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email.toLowerCase()
    }
  };

  try {
    const result = await docClient.send(new QueryCommand(params));
    return result.Items[0];
  } catch (error) {
    logger.error('Error getting user by email', { error });
    throw error;
  }
}

async function login(email, password) {
  const user = await getUserByEmail(email);
  
  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { 
      userId: user.userId, 
      email: user.email,
      userType: user.userType 
    },
    JWT_CONFIG.SECRET,
    { expiresIn: JWT_CONFIG.EXPIRATION }
  );

  logger.info(`User logged in: ${user.email}`);
  return { token, user: { ...user, password: undefined } };
}

module.exports = {
  UserType,
  createUser,
  getUserByEmail,
  login
};