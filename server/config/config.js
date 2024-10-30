require('dotenv').config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocumentClient, 
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

// Create DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create documented client for easier operations
const docClient = DynamoDBDocumentClient.from(client);

// Constants for table names
const TABLES = {
  USERS: 'Users',
  PRODUCTS: 'Producto'  // assuming this is your product table name
};

// JWT configuration
const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-fallback-secret-key',
  EXPIRATION: '24h'
};

module.exports = { 
  client, 
  docClient, 
  TABLES,
  JWT_CONFIG
};