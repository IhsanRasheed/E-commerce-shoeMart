// const userModel = require('../../Model/userModel')
// const categoryModel = require('../../Model/categoryModel')
// const productModel = require('../../Model/productModel')
// const cartModel = require('../../Model/cartModel')
// // const wishListModel = require('../../Model/wishlistModel')
// const couponModel = require('../../Model/couponModel')
// const order = require('../../Model/orderModel')
// const mongoose = require('mongoose')
// const instance = require('../../middleware/razorpay')
// const crypto = require('crypto')
// const paypal = require('paypal-rest-sdk')

// const checkOut = async (req, res) => {
//   try {
//     const cartItems = await cartModel.aggregate([
//       { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
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
//           // image: "$productDetails.image",
//           qty: '$qty',
//           id: '$productDetails._id',
//           userId: '$userId'
//         }
//       },
//       {
//         $addFields: {
//           total: { $multiply: ['$price', '$qty'] }
//         }
//       }
//     ])
//     const user = await userModel.findOne({ _id: req.session.user })
//     const brands = await productModel.distinct('brand')
//     const categories = await categoryModel.find({ status: true })
//     const address = await userModel.aggregate([
//       { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
//       { $unwind: '$address' },
//       {
//         $project: {
//           name: '$address.name',
//           addressline1: '$address.addressline1',
//           addressline2: '$address.addressline2',
//           district: '$address.distict',
//           state: '$address.state',
//           country: '$address.country',
//           pin: '$address.pin',
//           mobile: '$address.mobile',
//           id: '$address._id'
//         }
//       }
//     ])
//     const subtotal = cartItems.reduce(function (acc, curr) {
//       acc = acc + curr.total
//       return acc
//     }, 0)
//     // console.log(address);
//     res.render('../views/user/checkout.ejs', {
//       user,
//       brands,
//       categories,
//       address,
//       cartItems,
//       subtotal
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

// const postCheckOut = async (req, res) => {
//   try {
//     if (req.body.payment_mode === 'COD') {
//       const productData = await cartModel.aggregate([
//         { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
//         { $unwind: '$cartItem' },
//         {
//           $project: {
//             _id: 0,
//             productId: '$cartItem.productId',
//             quantity: '$cartItem.qty'
//           }
//         },
//         {
//           $lookup: {
//             from: 'products',
//             localField: 'productId',
//             foreignField: '_id',
//             as: 'productData'
//           }
//         },
//         { $unwind: '$productData' },
//         {
//           $project: {
//             _id: 0,
//             productId: '$productId',
//             quantity: '$quantity',
//             price: '$productData.price'

//           }
//         }
//       ])
//       console.log(productData)
//       const cartItems = await cartModel.aggregate([
//         { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
//         { $unwind: '$cartItem' },
//         {
//           $project: {
//             productId: '$cartItem.productId',
//             qty: '$cartItem.qty'
//           }
//         },
//         {
//           $lookup: {
//             from: 'products',
//             localField: 'productId',
//             foreignField: '_id',
//             as: 'productDetails'
//           }
//         },
//         { $unwind: '$productDetails' },
//         {
//           $project: {
//             price: '$productDetails.price',
//             qty: '$qty'
//           }
//         },
//         {
//           $addFields: {
//             total: { $multiply: ['$qty', '$price'] }
//           }
//         }
//       ])
//       const subtotal = cartItems.reduce((acc, curr) => {
//         acc = acc + curr.total
//         return acc
//       }, 0)

//       if (req.body.couponid === '') {
//         const orderDetails = new order({
//           userId: req.session.user,
//           name: req.body.name,
//           number: req.body.mobile,
//           address: {
//             addressline1: req.body.addressline1,
//             addressline2: req.body.addressline2,
//             district: req.body.district,
//             state: req.body.state,
//             country: req.body.country,
//             pin: req.body.pin
//           },
//           orderItems: productData,
//           subTotal: subtotal,
//           totalAmount: subtotal,
//           paymentMethod: 'COD'
//         })
//         await orderDetails.save()
//         res.redirect('/')
//         // res.json({CODSuccess:true})
//       } else {
//         await couponModel.updateOne({ _id: req.body.couponid }, { $push: { users: { userId: req.session.user } } })
//         const orderDetails = new order({
//           userId: req.session.user,
//           name: req.body.name,
//           number: req.body.mobile,
//           address: {
//             addressline1: req.body.addressline1,
//             addressline2: req.body.addressline2,
//             district: req.body.district,
//             state: req.body.state,
//             country: req.body.country,
//             pin: req.body.pin
//           },
//           orderItems: productData,
//           couponUsed: req.body.couponid,
//           subTotal: subtotal,
//           totalAmount: req.body.total,
//           paymentMethod: 'COD'
//         })
//         await orderDetails.save()
//         res.redirect('/')
//         // res.json({CODSuccess:true})
//       }
//     }
//     if (req.body.payment_mode === 'pay') {
//       const productData = await cartModel.aggregate([
//         { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
//         { $unwind: '$cartItem' },
//         {
//           $project: {
//             _id: 0,
//             productId: '$cartItem.productId',
//             quantity: '$cartItem.qty'
//           }
//         },
//         { $unwind: '$productData' },
//         {
//           $project: {
//             _id: 0,
//             productId: '$productId',
//             quantity: '$quantity',
//             price: '$productData.price'

//           }
//         }
//       ])

//       const cartItems = await cartModel.aggregate([
//         { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
//         { $unwind: '$cartItem' },
//         {
//           $project: {
//             productId: '$cartItem.productId',
//             qty: '$cartItem.qty'
//           }
//         },
//         {
//           $lookup: {
//             from: 'products',
//             localField: 'productId',
//             foreignField: '_id',
//             as: 'productDetails'
//           }
//         },
//         { $unwind: '$productDetails' },
//         {
//           $project: {
//             price: '$productDetails.price',
//             qty: '$qty'
//           }
//         },
//         {
//           $addFields: {
//             total: { $multiply: ['$qty', '$price'] }
//           }
//         }
//       ])
//       const subtotal = cartItems.reduce((acc, curr) => {
//         acc = acc + curr.total
//         return acc
//       }, 0)

//       if (req.body.couponid === '') {
//         const orderDetails = new order({
//           userId: req.session.user,
//           name: req.body.name,
//           number: req.body.mobile,
//           address: {
//             addressline1: req.body.addressline1,
//             addressline2: req.body.addressline2,
//             district: req.body.district,
//             state: req.body.state,
//             country: req.body.country,
//             pin: req.body.pin
//           },
//           orderItems: productData,
//           subTotal: subtotal,
//           totalAmount: subtotal,
//           paymentMethod: 'online Payment'
//         })

//         await orderDetails.save()
//         const total = parseInt(subtotal)
//         const create_payment_json = {
//           intent: 'sale',
//           payer: {
//             payment_method: 'paypal'
//           },
//           redirect_urls: {
//             return_url: 'http://localhost:4000/success',
//             cancel_url: 'http://localhost:4000/failed'
//           },
//           transactions: [{
//             item_list: {
//               items: [{
//                 name: 'item',
//                 sku: 'item',
//                 price: subtotal,
//                 currency: 'USD',
//                 quantity: 1
//               }]
//             },
//             amount: {
//               currency: 'USD',
//               total
//             },
//             description: 'This is the payment description.'
//           }]
//         }
//         paypal.payment.create(create_payment_json, async function (error, payment) {
//           if (error) {
//             throw error
//           } else {
//             for (let i = 0; i < payment.links.length; i++) {
//               if (payment.links[i].rel === 'approval_url') {
//                 res.redirect(payment.links[i].href)
//               }
//             }
//           }
//         })
//       } else {
//         await couponModel.updateOne({ _id: req.body.couponid }, { $push: { users: { userId: req.session.user } } })
//         const orderDetails = new order({
//           userId: req.session.user,
//           name: req.body.name,
//           number: req.body.mobile,
//           address: {
//             addressline1: req.body.addressline1,
//             addressline2: req.body.addressline2,
//             district: req.body.district,
//             state: req.body.state,
//             country: req.body.country,
//             pin: req.body.pin
//           },
//           orderItems: productData,
//           couponUsed: req.body.couponid,
//           subTotal: subtotal,
//           totalAmount: req.body.total,
//           paymentMethod: 'COD'
//         })
//         await orderDetails.save()

//         const totals = subtotal * 0.012
//         const total = parseInt(totals)
//         const create_payment_json = {
//           intent: 'sale',
//           payer: {
//             payment_method: 'paypal'
//           },
//           redirect_urls: {
//             return_url: 'http://localhost:4000/success',
//             cancel_url: 'http://localhost:4000/failed'
//           },
//           transactions: [{
//             item_list: {
//               items: [{
//                 name: 'item',
//                 sku: 'item',
//                 price: total,
//                 currency: 'USD',
//                 quantity: 1
//               }]
//             },
//             amount: {
//               currency: 'USD',
//               total
//             },
//             description: 'This is the payment description.'
//           }]
//         }
//         paypal.payment.create(create_payment_json, async function (error, payment) {
//           if (error) {
//             throw error
//           } else {
//             for (let i = 0; i < payment.links.length; i++) {
//               if (payment.links[i].rel === 'approval_url') {
//                 res.redirect(payment.links[i].href)
//               }
//             }
//           }
//         })
//       }
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

// paypal.configure({
//   mode: 'sandbox', // sandbox or live
//   client_id:
//       'AcXskD-_4tOiV4Jc9j0_AHbDQSkNbN_kH2zntIQeGdrwI5oSYZvQZWh9EzixiiKaBTWA_zzzLexd-jhv',
//   client_secret:
//       'EH9yBhfpuT8SPBR4RmcYgoZIgOp8eQwlazFXkedrqzfoIryDRBXmu9smKZFqSZM46VlLOYXLrnZ03Fg4'
// })

// // const verifyPayment= async (req, res) => {
// //   try{
// //     const details = req.body;
// //     let orderDetails=req.body.orderDetails
// //     let hmac = crypto.createHmac("sha256", process.env.KEYSECRET);
// //     hmac.update(details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id);
// //     hmac = hmac.digest("hex");

// //     if (hmac == details.payment.razorpay_signature) {
// //       if ( 'couponUsed' in orderDetails){
// //         await coupon.updateOne({_id:orderDetails.couponUsed}, { $push: { users: { userId:req.session.user} } })

// //       orderDetails=new order(orderDetails)
// //         await orderDetails.save()
// //       res.json({success:true})
// //       }else{
// //       let productDetails=orderDetails.orderItems
// //         for(let i =0;i<productDetails.length;i++){
// //             await product.updateOne({_id:productDetails[i]},{$inc:{stock:-(productDetails.quantity[i])}})
// //         }
// //         console.log(productDetails);
// //         orderDetails=new order(orderDetails)
// //         await orderDetails.save()
// //         res.json({success:true})
// //       }
// //     } else {
// //       console.log(err);
// //       res.json({ failed:true});
// //     }
// //   }catch(error){
// //     console.log(error)
// //   }
// //   }

// module.exports = {

//   checkOut,
//   postCheckOut

// }
