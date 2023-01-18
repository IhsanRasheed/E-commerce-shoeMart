const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  name: {
    type: String
  },
  status: {
    type: Boolean,
    default: true
  }
})

const categoryCollection = mongoose.model('category', categorySchema)

module.exports = categoryCollection
