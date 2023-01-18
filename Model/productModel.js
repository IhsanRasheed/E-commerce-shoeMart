const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'category'
  },
  brand: {
    type: String
  },
  size: {
    type: Number
  },
  description: {
    type: String
  },
  stock: {
    type: Number
  },
  price: {
    type: Number
  },
  image: {
    type: Array
  },
  status: {
    type: Boolean,
    default: true
  }
})

const productCollection = mongoose.model('product', productSchema)

module.exports = productCollection
