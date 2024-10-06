const { docClient } = require('../config/config'); // Importar config
const { PutCommand, ScanCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb"); //Importar funciones
const logger = require('../logger');  // Importar el logger

// Función para agregar un producto
async function addProduct(product) {
  const params = {
    TableName: "Producto",
    Item: product,
  };
  try {
    await docClient.send(new PutCommand(params));
    logger.info(`Producto añadido a DynamoDB: ${product.nombre} (${product.id})`);  // Registrar la adición del producto
  } catch (error) {
    logger.error('Error al agregar el producto en DynamoDB', { error });  // Registrar error en caso de fallo
    throw error;
  }
}

// Función para obtener todos los productos
async function getProducts() {
  const params = {
    TableName: "Producto",
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    logger.info('Productos obtenidos de DynamoDB');  // Registrar la obtención de productos
    return data.Items;
  } catch (error) {
    logger.error('Error al obtener los productos de DynamoDB', { error });  // Registrar error en caso de fallo
    throw error;
  }
}

// Función para borrar un producto por ID
async function deleteProduct(productId) {
  const params = {
    TableName: "Producto",
    Key: { id: productId },
  };
  try {
    await docClient.send(new DeleteCommand(params));
    logger.info(`Producto eliminado de DynamoDB: ID ${productId}`);  // Registrar la eliminación del producto
  } catch (error) {
    logger.error(`Error al eliminar el producto con ID ${productId} de DynamoDB`, { error });  // Registrar error en caso de fallo
    throw error;
  }
}

// Función para actualizar un producto
async function updateProduct(product) {
    const params = {
      TableName: "Producto",
      Item: product,
    };
    try {
      await docClient.send(new PutCommand(params)); // Usa PutCommand para reemplazar el producto
      logger.info(`Producto actualizado en DynamoDB: ${product.nombre} (${product.id})`); // Registrar la actualización
    } catch (error) {
      logger.error('Error al actualizar el producto en DynamoDB', { error }); // Registrar error
      throw error;
    }
  }
  

module.exports = { addProduct, getProducts, deleteProduct, updateProduct };
