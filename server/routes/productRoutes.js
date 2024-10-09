const express = require('express');
const { addProduct, getProducts, deleteProduct, updateProduct, getProduct } = require('../services/productService');
const router = express.Router();
const logger = require('../logger');  // Importar el logger
const multer = require('multer');  // Importar Multer
const path = require('path');
const fs = require('fs'); // Importar el módulo de sistema de archivos

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');  // Directorio donde se almacenarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);  // Renombrar el archivo para evitar colisiones
  },
});

const upload = multer({ storage });

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
router.post('/add', upload.single('imagen'), async (req, res) => {
  // Verificar si se proporcionó una imagen, de lo contrario, usar la imagen por defecto
  const imagen_url = req.file ? `/uploads/${req.file.filename}` : '/images/default-image.png';

  const product = {
    id: req.body.id,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
    precio_inicial: parseFloat(req.body.precio_inicial), // Asegúrate de que el precio sea un número
    duracion_remate: parseInt(req.body.duracion_remate, 10), // Asegúrate de que la duración sea un número
    imagen_url: imagen_url,  // Usar la URL de la imagen proporcionada o la imagen por defecto
  };

  try {
    await addProduct(product);
    logger.info(`Producto agregado: ${product.nombre} (${product.id})`);  // Registrar evento de adición de producto
    res.status(201).json({ message: 'Producto agregado exitosamente', product });
  } catch (error) {
    logger.error('Error al agregar el producto', { error });  // Registrar el error
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});


// Ruta para actualizar un producto
router.put('/update', upload.single('imagen'), async (req, res) => {
  const productId = req.body.id; // Obtén el ID del producto desde el cuerpo
  const productData = {
    id: productId,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
    precio_inicial: parseFloat(req.body.precio_inicial), // Asegúrate de que el precio sea un número
    duracion_remate: parseInt(req.body.duracion_remate, 10), // Asegúrate de que la duración sea un número
  };

  try {
    // Obtener el producto existente para verificar la imagen
    const existingProduct = await getProduct(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Si se proporciona una nueva imagen, elimina la imagen anterior
    if (req.file) {
      const oldImagePath = path.join(__dirname, '../../public', existingProduct.imagen_url.replace(/^\/+/, ''));

      // Evitar eliminar la imagen por defecto
      if (existingProduct.imagen_url !== '/images/default-image.png' && fs.existsSync(oldImagePath)) {
        await fs.promises.unlink(oldImagePath); // Eliminar la imagen antigua solo si no es la imagen por defecto
        console.log(`Imagen anterior eliminada: ${oldImagePath}`);
      } else {
        console.warn(`No se eliminó la imagen por defecto o no se encontró: ${oldImagePath}`);
      }

      // Guardar la nueva imagen
      const newImageUrl = `/uploads/${req.file.filename}`; // Ruta de la nueva imagen
      productData.imagen_url = newImageUrl; // Actualiza la ruta de la imagen en el producto
    } else {
      // Si no hay nueva imagen, mantener la imagen actual
      productData.imagen_url = existingProduct.imagen_url; // Mantiene la imagen existente
    }

    // Actualiza el producto en la base de datos
    await updateProduct(productData);
    
    logger.info(`Producto actualizado: ${productData.nombre} (${productId})`);  // Registrar la actualización
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    logger.error('Error al actualizar el producto', { error });  // Registrar el error
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


// Ruta para borrar un producto por ID
router.delete('/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await deleteProduct(productId);
    logger.info(`Producto eliminado: ID ${productId}`);  // Registrar evento de eliminación de producto
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    logger.error(`Error al eliminar el producto con ID ${productId}`, { error });  // Registrar error
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
