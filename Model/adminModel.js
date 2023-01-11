const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String
  }
})

const adminCollection = mongoose.model('Admin', adminSchema)

module.exports = adminCollection
