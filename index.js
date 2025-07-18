const express = require('express');
const { connectDB } = require('./src/config/db');
const userRoutes = require('./src/routes/user.routes');
const productRoutes = require('./src/routes/product.routes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 