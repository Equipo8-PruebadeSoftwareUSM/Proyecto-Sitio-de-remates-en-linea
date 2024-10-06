// services/productService.js
const { docClient } = require('../config/config');
const { PutCommand, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

// Función para agregar un producto
async function addProduct(product) {
  const params = {
    TableName: "Producto",
    Item: product
  };

  try {
    const data = await docClient.send(new PutCommand(params));
    console.log('result : ' + JSON.stringify(data));
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Función para obtener un producto por ID
async function getProduct(productId) {
  const params = {
    TableName: "Producto", 
    Key: {
      id: productId,
    },
  };

  try {
    const data = await docClient.send(new GetCommand(params));
    console.log('result : ' + JSON.stringify(data));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Función para borrar un producto por ID
async function deleteProduct(productId) {
    const params = {
      TableName: "Producto", 
      Key: {
        id: productId,
      },
    };
  
    try {
      const data = await docClient.send(new DeleteCommand(params));
      console.log('Producto borrado: ' + JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error al borrar el producto:", error);
    }
  }
  

module.exports = { addProduct, getProduct, deleteProduct };
