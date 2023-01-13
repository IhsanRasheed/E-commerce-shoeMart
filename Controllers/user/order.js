const userModel = require('../../Model/userModel')
const categoryModel = require('../../Model/categoryModel')
const productModel = require('../../Model/productModel')
const orderModel = require('../../Model/orderModel')
const mongoose = require('mongoose')

const orderPage = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.session.user })
    const categories = await categoryModel.find({ status: true })
    const brands = await productModel.distinct('brand')
    const order = await orderModel.find({ userId: req.session.user })
    res.render('user/orderPage', { user, categories, brands, order })
  } catch (error) {
    console.log(error)
  }
}

const orderCancel = async (req, res) => {
  try {
    const id = req.query.id
    res.redirect('/order')
    await orderModel.updateOne({ _id: id }, { $set: { orderStatus: 'cancelled' } })
  } catch (error) {
    console.log(error)
  }
}

const orderDetails = async (req, res) => {
  try {
    const id = req.query.id
    const user = await userModel.findOne({ _id: req.session.user })
    const categories = await categoryModel.find({ status: true })
    const brands = await productModel.distinct('brand')
    const productData = await orderModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $unwind: '$orderItems' },
      {
        $project: {
          name: '$name',
          number: '$number',
          address: '$address',
          productId: '$orderItems.productId',
          qty: '$orderItems.quantity',
          totalAmount: '$totalAmount',
          payment: '$paymentMethod',
          orderDate: '$orderDate',
          deliveryDate: '$deliveryDate'

        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productData'
        }
      },
      { $unwind: '$productData' },
      {
        $project: {
          name: '$name',
          number: '$number',
          address: '$address',
          productId: '$productId',
          qty: '$qty',
          totalAmount: '$totalAmount',
          payment: '$payment',
          orderDate: '$orderDate',
          deliveryDate: '$deliveryDate',
          productName: '$productData.name',
          brand: '$productData.brand',
          size: '$productData.size',
          price: '$productData.price',
          image: '$productData.image'
        }
      },
      {
        $addFields: {
          total: { $multiply: ['$qty', '$price'] }
        }
      }
    ])
    console.log(productData)
    res.render('user/orderHistory', { user, categories, brands, productData })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  orderPage,
  orderCancel,
  orderDetails
}
