require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 8001;
app.use(express.json());

const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/products.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send("Hello, World!");
});


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

