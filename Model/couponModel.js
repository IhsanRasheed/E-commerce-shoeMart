const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        code: {
            type:String
        },
        discount: {
            type: String
        },
        minAmount:{
            type: Number
        },
        startingDate:{
            type: Date
        },
        expiryDate: {
            type: Date
        },
        status:{
            type: Boolean,
            default:true
        },
        users: [
            {
                userId: mongoose.Types.ObjectId
            }
        ]

    }
)

const coupenCollection = mongoose.model('coupon', couponSchema)

module.exports = coupenCollection
