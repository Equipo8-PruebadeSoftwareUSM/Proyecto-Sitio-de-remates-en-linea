const express = require('express');
const { addProduct, getProducts, deleteProduct, updateProduct } = require('../services/productService'); // Inportar funciones
const router = express.Router();
const logger = require('../logger');  // Importar el logger

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    logger.info('Productos obtenidos exitosamente');  // Registrar evento de obtención de productos
    res.json(products);
  } catch (error) {
    logger.error('Error al obtener productos', { error });  // Registrar el error
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Endpoint para agregar un producto
router.post('/add', async (req, res) => {
  const product = req.body;
  try {
    await addProduct(product);
    logger.info(`Producto agregado: ${product.nombre} (${product.id})`);  // Registrar evento de adición de producto
    res.status(201).json({ message: 'Producto agregado exitosamente' });
  } catch (error) {
    logger.error('Error al agregar el producto', { error });  // Registrar el error
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Endpoint para borrar un producto por ID
router.delete('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await deleteProduct(productId);
    logger.info(`Producto eliminado: ID ${productId}`);  // Registrar evento de eliminación de producto
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    logger.error(`Error al eliminar el producto con ID ${productId}`, { error });  // Registrar el error
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

router.put('/update', async (req, res) => {
    const product = req.body;
    try {
      await updateProduct(product); // Asumiendo que tienes una función para actualizar en productService
      logger.info(`Producto actualizado: ${product.nombre} (${product.id})`);  // Registrar evento de actualización
      res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
      logger.error('Error al actualizar el producto', { error });  // Registrar el error
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });
  
module.exports = router;
