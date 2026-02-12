const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/products/:id
// @desc    Get a product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/products
// @desc    Add a new product
// @access  Private (admin only)
router.post('/', async (req, res) => {
  const { name, description, price, category, variants, images, inStock } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      variants,
      images,
      inStock
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private (admin only)
router.put('/:id', async (req, res) => {
  const { name, description, price, category, variants, images, inStock } = req.body;

  const productFields = {};
  if (name) productFields.name = name;
  if (description) productFields.description = description;
  if (price) productFields.price = price;
  if (category) productFields.category = category;
  if (variants) productFields.variants = variants;
  if (images) productFields.images = images;
  if (inStock !== undefined) productFields.inStock = inStock;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await Product.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;