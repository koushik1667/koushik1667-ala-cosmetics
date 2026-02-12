const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

  try {
    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders
// @desc    Get all orders for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/all
// @desc    Get all orders (admin only)
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Check if user owns this order
    if (order.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;