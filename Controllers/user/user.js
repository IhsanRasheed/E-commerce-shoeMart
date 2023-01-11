/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
const userModel = require('../../Model/userModel')
const categoryModel = require('../../Model/categoryModel')
const productModel = require('../../Model/productModel')
const cartModel = require('../../Model/cartModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const home = async (req, res) => {
  const user = await userModel.findOne({_id:req.session.user})
  const categories = await categoryModel.find({ status: true })
  const brands = await productModel.distinct('brand')
  res.render('user/home', { user,categories, brands })
}

const product = async (req, res) => {
  const user = await userModel.findOne({_id:req.session.user})
  const categories = await categoryModel.find({ status: true })
  const brands = await productModel.distinct('brand')
  const products = await productModel.find({ status: true })
  res.render('user/product', { user,categories, brands, products })
}

const productDetails = async (req, res) => {
  const user = await userModel.findOne({_id:req.session.user})
  const categories = await categoryModel.find({ status: true })
  const brands = await productModel.distinct('brand')
  const productId = req.query.id
  const productData = await productModel.findById(productId)
  res.render('user/productDetails.ejs', { user,categories, brands, productData })
}

const profile = async (req, res) => {
  const user = await userModel.findOne({_id:req.session.user})
  const categories = await categoryModel.find({ status: true })
  const brands = await productModel.distinct('brand')
  const address = await userModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.session.user)} },
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
        status:'$address.status'
      }
    },
      {
        $sort: { status: -1}
      }
  ])
  wrong = req.query.wrong
  succ = req.query.succ
  res.render('user/userProfile', { user,categories, brands, address,wrong,succ })
}

let profileEdit = async (req,res)=>{
  try{
  if(req.body.current_password && req.body.new_password){
    const userDetails=await userModel.findOne({_id : req.session.user})
    const hashedCheck = await bcrypt.compare(
         req.body.current_password,
         userDetails.password
       );
       if (hashedCheck == true){
        const hashedPassword = await bcrypt.hash(req.body.new_password, 10);
        await userModel.updateOne({ _id : req.session.user }, { $set: { password : hashedPassword,name : req.body.name } })
        res.redirect('/profile?succ=Password changed Successfully')
       }else{
        res.redirect('/profile?wrong=Current Password is Incorrect')
       }
  }else{
    res.redirect('/profile')
  }
}catch(error){
  console.log(error);
}
}

const addressAdd = async (req, res) => {
  try {
    const user = await userModel.findOne({_id:req.session.user})
    await userModel.updateOne(
      { _id:req.session.user },
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
    const user = await userModel.findOne({_id:req.session.user})
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
    res.render('user/addressEdit', { user,categories, brands, edit })
  }

  var addressPost = async (req, res) => {
    const user = await userModel.findOne({_id:req.session.user})
    await userModel.updateOne(
      { email:user.email,'address._id': id },
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
    const user = await userModel.findOne({_id:req.session.user})
    email=user.email
    await userModel.updateOne(
      { email },
      { $pull: { address: { _id: req.query.id } } }
    )
    res.redirect('/profile')
  } catch (error) {
    console.log(error)
  }
}

const addressDefault = async(req,res)=>{
  let id = req.query.id
  // console.log(id)
  await userModel.updateMany(
    {_id: mongoose.Types.ObjectId(req.session.user)},
    {$set: {'address.$[elem].status':false}},
    {arrayFilters:[{'elem.status':true}]},
  )
await userModel.updateOne(  
  {_id: req.session.user, "address._id":id},
  {$set: {"address.$.status": true} }
)
  res.redirect('/profile')
}


// const userCart = async (req, res) => {
//   try {
//     const brands = await productModel.distinct('brand')
//     const categories = await categoryModel.find({ status: true })
//     const email = 'ajmal@gmail.com'
//     const userId = await userModel.findOne({ email })
//     const cartItems = await cartModel.aggregate([
//       { $match: { userId: userId._id } },
//       { $unwind: '$cartItem' },
//       {
//         $project: {
//           productId: '$cartItem.productId',
//           qty: '$cartItem.qty'
//         }
//       },
//       {
//         $lookup: {
//           from: 'products',
//           localField: 'productId',
//           foreignField: '_id',
//           as: 'productDetails'
//         }
//       },
//       { $unwind: '$productDetails' },
//       {
//         $project: {
//           name: '$productDetails.name',
//           price: '$productDetails.price',
//           image: '$productDetails.image',
//           qty: '$qty',
//           id: '$productDetails._id'
//         }
//       },
//       {
//         $addFields: {
//           total: { $multiply: ['$price', '$qty'] }
//         }
//       }
//     ])
//     console.log(cartItems)
//     res.render('../views/user/cart.ejs', { brands, categories, cartItems })
//   } catch (error) {
//     console.log(error)
//   }
// }

// const addToCart = async (req, res) => {
//   try {
//     const email = 'ajmal@gmail.com'
//     const id = req.query.id
//     // console.log(id)
//     const userId = await userModel.findOne({ email })
//     console.log(userId._id)
//     const exist = await cartModel.find({
//       cartItem: { $elemMatch: { productId: id } }
//     })
//     console.log(exist)
//     if (exist.length === 0) {
//       await cartModel.updateOne(
//         { userId: userId._id },

//         { $push: { cartItem: { productId: id } } }
//       )
//       res.redirect('/cart')
//     } else {
//       await cartModel.updateOne(
//         { 'cartItem.productId': id },
//         { $inc: { 'cartItem.$.qty': 1 } }
//       )
//       res.redirect('/cart')
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

module.exports = {
  home,
  product,
  productDetails,
  profile,
  profileEdit,
  addressAdd,
  addressDelete,
  addressEdit,
  addressPost,
  addressDefault,
  // userCart,
  // addToCart
}
