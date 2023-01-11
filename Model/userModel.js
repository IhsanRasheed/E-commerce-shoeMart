const mongoose = require('mongoose')

// Defines the structure of document
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  mobile: {
    type: String
  },
  password: {
    type: String
  },
  status: {
    type: Boolean,
    default: true
  },
  address: [
    {
      name: String,
      addressline1: String,
      addressline2: String,
      district: String,
      state: String,
      country: String,
      pin: Number,
      mobile: Number,
      status: {
        type: Boolean,
        default: false
      }
    }
  ]
})

// Model and collection creation
const userCollection = mongoose.model('User', userSchema)

module.exports = userCollection
