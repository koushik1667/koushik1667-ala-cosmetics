const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  variants: [{
    type: {
      type: String, // e.g., 'color', 'size'
      required: true
    },
    values: [{
      value: {
        type: String,
        required: true
      },
      additionalPrice: {
        type: Number,
        default: 0
      }
    }]
  }],
  images: [{
    type: String, // URLs to images
    required: true
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);