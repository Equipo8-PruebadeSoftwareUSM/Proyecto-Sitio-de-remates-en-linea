const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = 8002; // Puerto de despliegue

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(express.static('public'));  // Sirve los archivos estáticos (HTML, CSS, JS)

// Usar las rutas de productos
app.use('/api/products', productRoutes);

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
