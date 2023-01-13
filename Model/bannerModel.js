const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    image: [
      {
        filename: String
      }
    ],
    date: {
      type: Date,
      default: Date.now()
    },
    status: {
      type: Boolean,
      default: true
    }

  }
)

const bannerCollection = mongoose.model('banner', bannerSchema)

module.exports = bannerCollection
