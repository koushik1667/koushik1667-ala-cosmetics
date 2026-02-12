const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Debug: Log current directory and files
console.log('Current directory:', __dirname);
console.log('Files in routes directory:', require('fs').readdirSync('./routes').filter(f => f.endsWith('.js')));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ala-cosmetic.netlify.app'] 
    : ['http://localhost:3010', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ala_cosmetics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('ALA Cosmetics API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});