const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  cartItem: [{
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'product'
    },
    qty: {
      type: Number,
      required: true,
      default: 1
    }
  }]
})

const cart = mongoose.model('cart', cartSchema)

module.exports = cart
