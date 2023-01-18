const adminModel = require('../../Model/adminModel')
const userModel = require('../../Model/userModel')
// const categoryModel = require('../../Model/categoryModel')
const productModel = require('../../Model/productModel')
// const cartModel = require('../../Model/cartModel')
const orderModel = require('../../Model/orderModel')

const login = (req, res) => {
  res.render('admin/adminLogin', req.query)
}

const logout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/admin/login')
  } catch (error) {
    console.log(error)
  }
}
const adminVerification = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const adminAccount = await adminModel.findOne({ email })
    if (email === adminAccount.email && password === adminAccount.password) {
      req.session.admin = email
      res.redirect('/admin/home')
    } else {
      res.redirect('/admin/login?wrong=Password wrong')
    }
  } catch (error) {
    res.redirect('/admin/login?wrong=User not exist')
  }
}

const adminHome = async (req, res) => {
  try {
    const users = await userModel.find().count()
    const productCount = await productModel.find().count()
    const totalOrder = await orderModel.find()
    const totalRevenue = totalOrder.reduce((acc, curr) => {
      acc = acc + curr.totalAmount
      return acc
    }, 0)
    const cancelOrder = await orderModel.find({ orderStatus: 'cancelled' }).count()
    const delivered = await orderModel.find({ orderStatus: 'delivered' }).count()
    const processing = await orderModel.find({ orderStatus: 'processing' }).count()
    const shipped = await orderModel.find({ orderStatus: 'shipped' }).count()
    res.render('admin/adminHome.ejs', {
      users,
      productCount,
      cancelOrder,
      totalRevenue,
      delivered,
      shipped,
      processing
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  login,
  logout,
  adminVerification,
  adminHome
}
