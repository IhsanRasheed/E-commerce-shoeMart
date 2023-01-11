const mongoose = require('mongoose')

const wishSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  },
  wishList: [{
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

const wishlist = mongoose.model('wishList', wishSchema)

module.exports = wishlist
