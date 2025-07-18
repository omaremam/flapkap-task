const express = require('express');
const { connectDB } = require('./src/config/db');
const userRoutes = require('./src/routes/user.routes');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}); 