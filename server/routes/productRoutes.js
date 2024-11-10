const express = require('express');
const { addProduct, getProducts, deleteProduct, updateProduct, getProduct } = require('../services/productService');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();
const logger = require('../logger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
router.get('/', authMiddleware, async (req, res) => {
  try {
    logger.info(`Attempting to fetch products for user: ${req.user.userId}`);
    const products = await getProducts();
    logger.info(`Products retrieved successfully. Count: ${products.length}`);
    logger.debug('Products:', JSON.stringify(products)); // Be careful with this in production
    res.json(products);
  } catch (error) {
    logger.error('Error getting products', { error: error.message, stack: error.stack, userId: req.user.userId });
    res.status(500).json({ error: 'Error getting products' });
  }
});

// Endpoint para agregar un producto
router.post('/add',authMiddleware,adminMiddleware, upload.single('imagen'), async (req, res) => {
  // Verificar si se proporcionó una imagen, de lo contrario, usar la imagen por defecto
  const imagen_url = req.file ? `/uploads/${req.file.filename}` : '/images/default-image.png';

  const product = {
    id: req.body.id,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
    precio_inicial: parseFloat(req.body.precio_inicial), // Asegúrate de que el precio sea un número
    duracion_remate: req.body.duracion_remate, // Asegúrate de que la duración sea una fecha
    imagen_url: imagen_url,  // Usar la URL de la imagen proporcionada o la imagen por defecto
  };

  try {
    await addProduct(product);
    logger.info(`Product added by admin: ${req.user.userId}`);
    // Registrar evento de adición de producto
    res.status(201).json({ message: 'Producto agregado exitosamente', product });
  } catch (error) {
    logger.error('Error adding product', { error, userId: req.user.userId });
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Ruta para actualizar un producto
router.put('/update', authMiddleware, adminMiddleware, upload.single('imagen'), async (req, res) => {
  const productId = req.body.id; // Obtener el ID del producto desde el cuerpo
  const productData = {
    id: productId,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    categoria: req.body.categoria,
    precio_inicial: parseFloat(req.body.precio_inicial), 
    duracion_remate: req.body.duracion_remate, 
  };

  try {
    // Obtener el producto existente para verificar la imagen
    const existingProduct = await getProduct(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (req.file) {
      const newImageName = req.file.filename;
      const currentImageUrl = existingProduct.imagen_url;

      // Verificar si la nueva imagen es diferente a la actual
      const currentImageName = currentImageUrl.split('/').pop();

      if (newImageName !== currentImageName) {
        console.log('Nueva imagen cargada:', req.file);

        // Guardar la nueva imagen
        const newImageUrl = `/uploads/${newImageName}`; // Ruta de la nueva imagen
        productData.imagen_url = newImageUrl; // Actualiza la ruta de la imagen en el producto
        console.log('Nueva imagen URL establecida:', newImageUrl);

        // Solo después de guardar la nueva imagen, intenta eliminar la anterior
        const oldImagePath = path.join(__dirname, '../../public', currentImageUrl.replace(/^\/+/, ''));

        // Si la imagen actual no es la imagen por defecto, eliminar la imagen antigua
        if (currentImageUrl !== '/images/default-image.png' && currentImageUrl.startsWith('/uploads/') && fs.existsSync(oldImagePath)) {
          await fs.promises.unlink(oldImagePath); // Eliminar la imagen antigua
          console.log(`Imagen anterior eliminada: ${oldImagePath}`);
        } else {
          console.warn(`No se eliminó la imagen por defecto o no se encontró: ${oldImagePath}`);
        }
      } else {
        // Si la nueva imagen es la misma que la actual
        productData.imagen_url = existingProduct.imagen_url;
        console.log('La nueva imagen es igual a la existente, no se actualiza la imagen.');
      }
    } else {
      // Si no hay nueva imagen, mantener la imagen actual
      productData.imagen_url = existingProduct.imagen_url;
      console.log('Manteniendo imagen existente:', existingProduct.imagen_url);
    }

    // Verifica los datos del producto antes de actualizar en la base de datos
    console.log('Datos del producto a actualizar:', productData);

    // Actualiza el producto en la base de datos
    await updateProduct(productData);
    console.log('Producto actualizado en la base de datos:', productData);

    logger.info(`Producto actualizado: ${productData.nombre} (${productId})`);  // Registrar la actualización
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    // Registrar el error con más detalles
    logger.error('Error al actualizar el producto', { error: error.message || error, stack: error.stack });
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});


// Ruta para borrar un producto por ID
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
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
