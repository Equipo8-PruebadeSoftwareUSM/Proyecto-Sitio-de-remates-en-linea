const express = require('express');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const logger = require('./logger');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Add authentication routes
app.use('/api/auth', authRoutes);

// Use existing product routes
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});