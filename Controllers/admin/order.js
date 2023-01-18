const orderModel = require('../../Model/orderModel')
const mongoose = require('mongoose')
const management = async (req, res) => {
  try {
    orderModel.find().then((orders) => {
      res.render('admin/orderMangement', { orders })
    })
  } catch (error) {
    console.log(error)
  }
}

const update = async (req, res) => {
  try {
    const id = req.body.orderid
    const status = req.body.orderstatus
    await orderModel.updateOne({ _id: id }, { $set: { orderStatus: status } })

    res.redirect('/admin/order')
  } catch (error) {
    console.log(error)
  }
}
const viewOrder = async (req, res) => {
  try {
    let id = req.query.id
    id = mongoose.Types.ObjectId(id)
    const productData = await orderModel.aggregate([
      { $match: { _id: id } },
      { $unwind: '$orderItems' },
      {
        $project: {
          address: '$address',
          totalAmount: '$totalAmount',
          productId: '$orderItems.productId',
          productQty: '$orderItems.quantity'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'data'
        }
      },
      { $unwind: '$data' },
      {
        $project: {
          address: '$address',
          totalAmount: '$totalAmount',
          productQty: '$productQty',
          image: '$data.image',
          name: '$data.name',
          brand: '$data.brand',
          price: '$data.price'

        }
      },
      {
        $addFields: {
          total: { $multiply: ['$productQty', '$price'] }
        }
      }

    ])
    res.render('admin/orderView.ejs', { productData })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  management,
  update,
  viewOrder
}
