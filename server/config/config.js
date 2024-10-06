require('dotenv').config();  // Cargar variables de entorno desde .env
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Crear el cliente de DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Crear el cliente documentado para facilitar las operaciones
const docClient = DynamoDBDocumentClient.from(client);

module.exports = { client, docClient};

