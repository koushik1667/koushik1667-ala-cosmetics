const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const initialProducts = [
  {
    id: '1',
    name: 'Silver Wave Highlight',
    price: 3499.00,
    description: 'A radiant silver-toned highlighter for a metallic glow.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800',
    inStock: true,
    variants: [
      { name: 'Shade', options: ['Pure Silver', 'Moonlight Gold', 'Champagne Frost'] }
    ]
  },
  {
    id: '2',
    name: 'Midnight Velvet Lipstick',
    price: 1899.00,
    description: 'Deep matte black lipstick with extreme pigment.',
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=800',
    inStock: true,
    variants: [
      { name: 'Finish', options: ['Matte', 'Satin', 'Glossy'] }
    ]
  },
  {
    id: '3',
    name: 'Ocean Pearl Serum',
    price: 6499.00,
    description: 'Infused with crushed pearls for deep skin hydration.',
    image: 'https://images.unsplash.com/photo-1570172619380-2126ad04840b?q=80&w=800',
    inStock: true,
    variants: [
      { name: 'Size', options: ['30ml', '50ml', '100ml'] }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ala_cosmetics', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Transform and insert initial products
    const transformedProducts = initialProducts.map(product => ({
      _id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: 'Cosmetics', // Default category
      variants: product.variants?.map(variant => ({
        type: variant.name,
        values: variant.options.map(option => ({ value: option }))
      })) || [],
      images: [product.image], // Convert single image to array
      inStock: product.inStock
    }));

    await Product.insertMany(transformedProducts);
    console.log('Added initial products to database');

    // Close connection
    await mongoose.connection.close();
    console.log('Database seeding completed');
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

seedDatabase();