const { docClient } = require('../config/config'); // Importar config
const { PutCommand, ScanCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb"); // Importar funciones
const logger = require('../logger');  // Importar el logger
const fs = require('fs');  // Importar el módulo de sistema de archivos
const path = require('path');  // Importar el módulo para manejar rutas

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

async function getProducts() {
  const params = {
    TableName: "Producto",
  };
  try {
    logger.info('Attempting to fetch products from DynamoDB');
    const data = await docClient.send(new ScanCommand(params));
    logger.info(`Products fetched successfully from DynamoDB. Count: ${data.Items.length}`);
    logger.debug('Raw DynamoDB response:', JSON.stringify(data)); // Be careful with this in production
    return data.Items;
  } catch (error) {
    logger.error('Error fetching products from DynamoDB', { error: error.message, stack: error.stack });
    throw error;
  }
}
async function getProduct(productId) {
  const params = {
    TableName: "Producto",
    Key: { id: productId },
  };

  try {
    const data = await docClient.send(new GetCommand(params));
    return data.Item;  // Retornar el producto encontrado
  } catch (error) {
    logger.error('Error al obtener el producto de DynamoDB', { error });  // Registrar error
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
    const product = await getProduct(productId); // Obtener el producto
    if (!product) {
      throw new Error(`Producto con ID ${productId} no encontrado`);
    }

    await docClient.send(new DeleteCommand(params));  // Eliminar el producto de DynamoDB

    // Eliminar la imagen del sistema de archivos
    const imagePath = path.join(__dirname, '../../public', product.imagen_url.replace(/^\/+/, ''));
    if (fs.existsSync(imagePath)) {
      await fs.promises.unlink(imagePath); // Usa promesas para eliminar la imagen
      console.log(`Imagen eliminada: ${imagePath}`);
    } else {
      console.warn(`El archivo no existe: ${imagePath}`);
    }

    logger.info(`Producto eliminado de DynamoDB: ID ${productId}`);  // Registrar la eliminación del producto
  } catch (error) {
    logger.error(`Error al eliminar el producto con ID ${productId}`, { error });  // Registrar error
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

module.exports = { addProduct, getProducts, deleteProduct, updateProduct, getProduct };
