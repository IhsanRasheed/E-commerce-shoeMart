/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const userModel = require('../../Model/userModel')
const categoryModel = require('../../Model/categoryModel')
const productModel = require('../../Model/productModel')
const cartModel = require('../../Model/cartModel')
const bannerModel = require('../../Model/bannerModel')
const mongoose = require('mongoose')
const orderModel = require('../../Model/orderModel')
const bcrypt = require('bcrypt')

const home = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.user })
  const categories = await categoryModel.find({ status: true })
  const brands = await productModel.distinct('brand')
  const banner = await bannerModel.find({ status: true })
  res.render('user/home', { user, categories, brands, banner })
}

const error = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.user })
  const categories = await categoryModel.find({ status: true })
  const brands = await productModel.distinct('brand')
  const order = await orderModel.find({ userId: req.session.user })
  res.render('user/error404', { user, categories, brands, order })
}

const search = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.session.user })
    const categories = await categoryModel.find({ status: true })
    const brands = await productModel.distinct('brand')
    const key = req.body.search
    // console.log(key)
    const products = await productModel.find({
      $or: [
        { name: new RegExp(key, 'i') }
        // { category: new RegExp(key, "i") },
      ]
    })
    if (products.length) {
      res.render('user/product', { user, categories, brands, products })
    } else {
      res.render('user/product', { user, categories, brands, products, message: 'Ooops ...! No Match' })
    }
  } catch (error) {
    console.log(error)
  }
}

const product = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.session.user })
    const categories = await categoryModel.find({ status: true })
    const brands = await productModel.distinct('brand')
    if (req.query.catId && req.query.brand) {
      const products = await productModel.find({ category: req.query.catId, brand: req.query.brand, status: true })
      res.render('user/product', { user, categories, brands, products })
    } else {
      const products = await productModel.find({ category: req.query.catId, status: true })
      res.render('user/product', { user, categories, brands, products })
    }
  } catch (error) {
    console.log(error)
  }
}

const productDetails = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.user })
  const categories = await categoryModel.find({ status: true })
  const brands = await productModel.distinct('brand')
  const productId = req.query.id
  const productData = await productModel.findById(productId)
  res.render('user/productDetails.ejs', { user, categories, brands, productData })
}

const profile = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.user })
  const categories = await categoryModel.find({ status: true })
  const brands = await productModel.distinct('brand')
  const address = await userModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
    { $unwind: '$address' },
    {
      $project: {
        name: '$address.name',
        addressline1: '$address.addressline1',
        addressline2: '$address.addressline2',
        district: '$address.district',
        state: '$address.state',
        country: '$address.country',
        pin: '$address.pin',
        mobile: '$address.mobile',
        id: '$address._id',
        status: '$address.status'
      }
    },
    {
      $sort: { status: -1 }
    }
  ])
  const wrong = req.query.wrong
  const succ = req.query.succ
  res.render('user/userProfile', { user, categories, brands, address, wrong, succ })
}

const profileEdit = async (req, res) => {
  try {
    if (req.body.current_password && req.body.new_password) {
      const userDetails = await userModel.findOne({ _id: req.session.user })
      const hashedCheck = await bcrypt.compare(
        req.body.current_password,
        userDetails.password
      )
      if (hashedCheck === true) {
        const hashedPassword = await bcrypt.hash(req.body.new_password, 10)
        await userModel.updateOne({ _id: req.session.user }, { $set: { password: hashedPassword, name: req.body.name } })
        res.redirect('/profile?succ=Password changed Successfully')
      } else {
        res.redirect('/profile?wrong=Current Password is Incorrect')
      }
    } else {
      res.redirect('/profile')
    }
  } catch (error) {
    console.log(error)
  }
}

const addressAdd = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.session.user })
    await userModel.updateOne(
      { _id: req.session.user },
      {
        $push: {
          address: {
            name: req.body.name,
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin,
            mobile: req.body.mobile
          }
        }
      }
    )
    res.redirect('/profile')
  } catch (error) {
    console.log(error)
  }
}

{
  let id

  var addressEdit = async (req, res) => {
    id = req.query.id
    const user = await userModel.findOne({ _id: req.session.user })
    const categories = await categoryModel.find({ status: true })
    const brands = await productModel.distinct('brand')
    const edit = await userModel.aggregate([
      { $match: { email: user.email } },
      { $unwind: '$address' },
      {
        $project:
            {
              name: '$address.name',
              addressline1: '$address.addressline1',
              addressline2: '$address.addressline2',
              district: '$address.district',
              state: '$address.state',
              country: '$address.country',
              pin: '$address.pin',
              mobile: '$address.mobile',
              id: '$address._id'
            }
      },
      { $match: { id: mongoose.Types.ObjectId(req.query.id) } }
    ])
    res.render('user/addressEdit', { user, categories, brands, edit })
  }

  var addressPost = async (req, res) => {
    const user = await userModel.findOne({ _id: req.session.user })
    await userModel.updateOne(
      { email: user.email, 'address._id': id },
      {
        $set: {
          // name: req.body.name,
          // addressline1: req.body.addressline1,
          // addressline2: req.body.addressline2,
          // district: req.body.district,
          // state: req.body.state,
          // country: req.body.country,
          // pin: req.body.pin,
          // mobile: req.body.mobile
          'address.$.name': req.body.name,
          'address.$.addressline1': req.body.addressline1,
          'address.$.addressline2': req.body.addressline2,
          'address.$.district': req.body.district,
          'address.$.state': req.body.state,
          'address.$.country': req.body.country,
          'address.$.pin': req.body.pin,
          'address.$.mobile': req.body.mobile
        }
      }
    )
    res.redirect('/profile')
  }
}

const addressDelete = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.session.user })
    const email = user.email
    await userModel.updateOne(
      { email },
      { $pull: { address: { _id: req.query.id } } }
    )
    res.redirect('/profile')
  } catch (error) {
    console.log(error)
  }
}

const addressDefault = async (req, res) => {
  const id = req.query.id
  // console.log(id)
  await userModel.updateMany(
    { _id: mongoose.Types.ObjectId(req.session.user) },
    { $set: { 'address.$[elem].status': false } },
    { arrayFilters: [{ 'elem.status': true }] }
  )
  await userModel.updateOne(
    { _id: req.session.user, 'address._id': id },
    { $set: { 'address.$.status': true } }
  )
  res.redirect('/profile')
}

module.exports = {
  home,
  error,
  search,
  product,
  productDetails,
  profile,
  profileEdit,
  addressAdd,
  addressDelete,
  addressEdit,
  addressPost,
  addressDefault

}
