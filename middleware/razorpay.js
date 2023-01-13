const razorpay = require('razorpay')
require('dotenv').config()

const instance = new razorpay({
  key_id: process.env.KEYID,
  key_secret: process.env.KEYSECRET
})

module.exports = instance
