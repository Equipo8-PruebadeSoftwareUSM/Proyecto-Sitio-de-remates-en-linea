// test.js
const { addProduct, getProduct, deleteProduct } = require('./services/productService');

// Producto de prueba
const newProduct = {
  id: "TeleporterX-001",  // Identificador único
  nombre: "Teletransportador inestable",  // Nombre descriptivo
  descripcion: "Dispositivo de teletransportación inestable, recuperado de las ruinas de Black Mesa. Usado con precaución.",  // Descripción del producto
  categoria: "tecnología alienígena",  // Categoría
  precio_inicial: 50000,  // Precio inicial en créditos (ejemplo)
  duracion_remate: 86400,  // Duración del remate en segundos (24 horas)
  imagen_url: "https://example.com/imagenes/teletransportador.png"  // URL de la imagen del producto
};

// Función de prueba para agregar y obtener el producto
async function testProductOperations() {
  console.log("Agregando producto...");
  await addProduct(newProduct);

  console.log("Obteniendo producto...");
  await getProduct("TeleporterX-001");

  // console.log("Borrando producto...");
  // await deleteProduct("Product02")
}

testProductOperations();
