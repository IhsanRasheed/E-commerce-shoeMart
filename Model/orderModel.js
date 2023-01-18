const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId
  },
  name: {
    type: String
  },
  number: {
    type: Number
  },
  address: {
    addressline1: String,
    addressline2: String,
    district: String,
    state: String,
    country: String,
    pin: Number
  },
  orderItems: [
    {
      productId: mongoose.Types.ObjectId,
      quantity: Number,
      price: Number
    }
  ],
  couponUsed: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  subTotal: {
    type: Number
  },
  totalAmount: {
    type: Number
  },
  orderStatus: {
    type: String,
    default: 'processing'
  },
  paymentMethod: {
    type: String
  },
  orderDate: {
    type: Date,
    default: Date.now()
  },
  deliveryDate: {
    type: String,
    default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  }

})

const orderModel = mongoose.model('order', orderSchema)

module.exports = orderModel
