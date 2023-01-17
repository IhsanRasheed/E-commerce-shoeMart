const userModel = require('../../Model/userModel')
const categoryModel = require('../../Model/categoryModel')
const productModel = require('../../Model/productModel')
const cartModel = require('../../Model/cartModel')
const wishListModel = require('../../Model/wishlistModel')
const couponModel = require('../../Model/couponModel')
const order = require('../../Model/orderModel')
const mongoose = require('mongoose')
const instance = require('../../middleware/razorpay')
const crypto = require('crypto')
const paypal = require('paypal-rest-sdk')

const userCart = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.session.user })
    const brands = await productModel.distinct('brand')
    const categories = await categoryModel.find({ status: true })

    const cartItems = await cartModel.aggregate([
      { $match: { userId: user._id } },
      { $unwind: '$cartItem' },
      {
        $project: {
          productId: '$cartItem.productId',
          qty: '$cartItem.qty'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          name: '$productDetails.name',
          price: '$productDetails.price',
          image: '$productDetails.image',
          qty: '$qty',
          id: '$productDetails._id'
        }
      },
      {
        $addFields: {
          total: { $multiply: ['$price', '$qty'] }
        }
      }
    ])

    const subtotal = cartItems.reduce(function (acc, curr) {
      acc = acc + curr.total
      return acc
    }, 0)
    // console.log(cartItems)
    res.render('../views/user/cart.ejs', {
      user,
      brands,
      categories,
      cartItems,
      subtotal
    })
  } catch (error) {
    console.log(error)
  }
}

// const addToCart = async (req, res) => {
//   try {
//     const id = req.query.id;
//     let exist1 = await cartModel.aggregate([
//       {
//         $match: {
//           $and: [
//             { userId: mongoose.Types.ObjectId(req.session.user) },
//             {
//               cartItem: {
//                 $elemMatch: { productId: new mongoose.Types.ObjectId(id) },
//               },
//             },
//           ],
//         },
//       },
//     ]);
//     console.log(exist1);

//     if (exist1.length === 0) {
//       await cartModel.updateOne(
//         { userId: req.session.user },
//         { $push: { cartItem: { productId: id } } },
//         { upsert: true }
//       );
//       res.redirect("/cart");
//     } else {
//       await cartModel.updateOne(
//         { "cartItem.productId": id },
//         { $inc: { "cartItem.$.qty": 1 } }
//       );
//       res.redirect("/cart");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const addtocart = async (req, res) => {
  try {
    const proId = req.body.Id
    const Id = mongoose.Types.ObjectId(proId)
    const productData = await productModel.findOne({ _id: proId })
    const id = mongoose.Types.ObjectId(req.session.user)
    if (productData.stock > 0) {
      const cartExist = await cartModel.findOne({ userId: id })
      if (cartExist) {
        const exist1 = await cartModel.aggregate([
          {
            $match: {
              $and: [
                { userId: mongoose.Types.ObjectId(req.session.user) },
                {
                  cartItem: {
                    $elemMatch: { productId: new mongoose.Types.ObjectId(proId) }
                  }
                }
              ]
            }
          }
        ])
        if (exist1.length === 0) {
          const dataPush = await cartModel.updateOne({ userId: id },
            {
              $push: { cartItem: { productId: proId } }
            }
          )
          const cartData = await cartModel.findOne({ userId: id })
          const count = cartData.cartItem.length
          res.json({ success: true, count })
        } else {
          res.json({ exist: true })
        }
      } else {
        const addCart = new cartModel({
          userId: id,
          cartItem: [{ productId: proId }]
        })
        await addCart.save()
        const cartData = await cartModel.findOne({ userId: id })
        const count = cartData.cartItem.length
        //  console.log(count);
        res.json({ success: true, count })
      }
    } else {
      res.json({ outofStock: true })
    }
  } catch (error) {
    console.log(error)
  }
}

const productQtyAdd = async (req, res) => {
  try {
    const data = req.body
    const proId = data.Id
    const qty = parseInt(data.qty)
    const productData = await productModel.findOne({ _id: proId })
    if (productData.stock > 0) {
      if (qty < 10) {
        const price = productData.price
        await cartModel.updateOne(
          { userId: req.session.user, 'cartItem.productId': proId },
          { $inc: { 'cartItem.$.qty': 1 } })
        res.json({ price })
      } else {
        res.json({ limit: true })
      }
    } else {
      res.json({ outStock: true })
    }
  } catch (error) {
    console.log(error)
  }
}

const productQtySub = async (req, res) => {
  try {
    const data = req.body
    const proId = data.Id
    const qty = parseInt(data.qty)
    const productData = await productModel.findOne({ _id: proId })
    if (productData.stock > 0) {
      if (qty > 1) {
        const price = productData.price
        await cartModel.updateOne(
          { userId: req.session.user, 'cartItem.productId': proId },
          { $inc: { 'cartItem.$.qty': -1 } })
        res.json({ price })
      } else {
        res.json({ limit: true })
      }
    } else {
      res.json({ outStock: true })
    }
  } catch (error) {
    console.log(error)
  }
}

const cartDelete = async (req, res) => {
  try {
    // let email = "ajmal@gmail.com";
    // let userId = await customer.findOne({ email: email });
    await cartModel.updateOne(
      { userId: req.session.user },
      { $pull: { cartItem: { productId: req.query.id } } }
    )
    res.redirect('/cart')
  } catch (error) {
    console.log(error)
  }
}

// const productQtyAdd = async (req, res) => {
//   try {
//     let id = req.query.id;
//     await cartModel.updateOne(
//       { userId: req.session.user, "cartItem.productId": id },
//       { $inc: { "cartItem.$.qty": 1 } }
//     );
//     res.redirect("/cart");
//   } catch (error) {
//     console.log(error);
//   }
// };

// const productQtySub = async (req, res) => {
//   try {
//     let id = req.query.id;
//     await cartModel.updateOne(
//       { userId: req.session.user, "cartItem.productId": id },
//       { $inc: { "cartItem.$.qty": -1 } }
//     );
//     res.redirect("/cart");
//   } catch (error) {
//     console.log(error);
//   }
// };

const userWishlist = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.session.user })
    const brands = await productModel.distinct('brand')
    const categories = await categoryModel.find({ status: true })
    const wishList = await wishListModel.aggregate([
      { $match: { userId: user._id } },
      { $unwind: '$wishList' },
      {
        $project: {
          productId: '$wishList.productId',
          qty: '$wishList.qty'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          name: '$productDetails.name',
          price: '$productDetails.price',
          image: '$productDetails.image',
          qty: '$qty',
          id: '$productDetails._id'
        }
      },
      {
        $addFields: {
          total: { $multiply: ['$price', '$qty'] }
        }
      }
    ])

    res.render('user/wishlist', { user, brands, categories, wishList })
  } catch (error) {
    console.log(error)
  }
}

// Ajax

const addWishlist = async (req, res) => {
  try {
    const id = req.body.prodId
    const wish = await wishListModel.findOne({ userId: mongoose.Types.ObjectId(req.session.user) })
    if (wish) {
      const wishlistEx = wish.wishList.findIndex((wishList) =>
        wishList.productId == id
      )
      if (wishlistEx != -1) {
        res.json({ wish: true })
      } else {
        const dataPush = await wishListModel.updateOne({ userId: mongoose.Types.ObjectId(req.session.user) },
          {
            $push: { wishList: { productId: id } }
          })
        const wishlistData = await wishListModel.findOne({ userId: mongoose.Types.ObjectId(req.session.user) })
        const count = wishlistData.wishList.length
        console.log(count)
        res.json({ success: true, count })
      }
    } else {
      const addWish = new wishlist({
        userId,
        wishList: [{ productId: id }]
      })
      await addWishlist.save()
      const wishlistData = await wishlist.findOne({ userId: mongoose.Types.ObjectId(req.session.user) })
      const count = wishlistData.wishList.length
      res.json({ success: true, count })
    }

    // res.redirect('/wishlist')
  } catch (error) {
    console.log('addtowishlist error ' + error)
  }
}

const wishDelete = async (req, res) => {
  try {
    // let email = "ajmal@gmail.com";
    // let userId = await customer.findOne({ email: email });
    await wishListModel.updateOne(
      { userId: req.session.user },
      { $pull: { wishList: { productId: req.query.id } } }
    )
    res.redirect('/wishlist')
  } catch (error) {
    console.log(error)
  }
}

// const checkout =  async (req,res) => {
//   try{
//     const user = await userModel.findOne({_id:req.session.user})
//     const brands = await productModel.distinct('brand')
//     const categories = await categoryModel.find({ status: true })

//     res.render('user/checkout',{ user,brands, categories})
//   }catch(error){
//     console.log(error)
//   }
// }

// let subtotal;
const checkOut = async (req, res) => {
  try {
    // let cartItems=req.query.cartItems
    // subtotal = req.query.subtotal;
    // console.log(cartItems);
    // console.log(subtotal);
    const cartItems = await cartModel.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
      { $unwind: '$cartItem' },
      {
        $project: {
          productId: '$cartItem.productId',
          qty: '$cartItem.qty'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $project: {
          name: '$productDetails.name',
          price: '$productDetails.price',
          // image: "$productDetails.image",
          qty: '$qty',
          id: '$productDetails._id',
          userId: '$userId'
        }
      },
      {
        $addFields: {
          total: { $multiply: ['$price', '$qty'] }
        }
      }
    ])
    const user = await userModel.findOne({ _id: req.session.user })
    const brands = await productModel.distinct('brand')
    const categories = await categoryModel.find({ status: true })
    const address = await userModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.session.user) } },
      { $unwind: '$address' },
      {
        $project: {
          name: '$address.name',
          addressline1: '$address.addressline1',
          addressline2: '$address.addressline2',
          district: '$address.distict',
          state: '$address.state',
          country: '$address.country',
          pin: '$address.pin',
          mobile: '$address.mobile',
          id: '$address._id'
        }
      }
    ])
    const subtotal = cartItems.reduce(function (acc, curr) {
      acc = acc + curr.total
      return acc
    }, 0)
    // console.log(address);
    res.render('../views/user/checkout.ejs', {
      user,
      brands,
      categories,
      address,
      cartItems,
      subtotal
    })
  } catch (error) {
    console.log(error)
  }
}

const postCheckOut = async (req, res) => {
  try {
    if (req.body.payment_mode == 'COD') {
      const productData = await cartModel.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
        { $unwind: '$cartItem' },
        {
          $project: {
            _id: 0,
            productId: '$cartItem.productId',
            quantity: '$cartItem.qty'
          }
        }
      ])
      const cartItems = await cartModel.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
        { $unwind: '$cartItem' },
        {
          $project: {
            productId: '$cartItem.productId',
            qty: '$cartItem.qty'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        {
          $project: {
            price: '$productDetails.price',
            qty: '$qty'
          }
        },
        {
          $addFields: {
            total: { $multiply: ['$qty', '$price'] }
          }
        }
      ])
      const subtotal = cartItems.reduce((acc, curr) => {
        acc = acc + curr.total
        return acc
      }, 0)

      if (req.body.couponid === '') {
        const orderDetails = new order({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin
          },
          orderItems: productData,
          subTotal: subtotal,
          totalAmount: subtotal,
          paymentMethod: 'COD'
        })
        await orderDetails.save()
        res.redirect('/')
        // res.json({CODSuccess:true})
      } else {
        await couponModel.updateOne({ _id: req.body.couponid }, { $push: { users: { userId: req.session.user } } })
        const orderDetails = new order({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin
          },
          orderItems: productData,
          couponUsed: req.body.couponid,
          subTotal: subtotal,
          totalAmount: req.body.total,
          paymentMethod: 'COD'
        })
        await orderDetails.save()
        res.redirect('/')
        // res.json({CODSuccess:true})
      }
    }
    if (req.body.payment_mode == 'pay') {
      const productData = await cartModel.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
        { $unwind: '$cartItem' },
        {
          $project: {
            _id: 0,
            productId: '$cartItem.productId',
            quantity: '$cartItem.qty'
          }
        }
      ])

      const cartItems = await cartModel.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.session.user) } },
        { $unwind: '$cartItem' },
        {
          $project: {
            productId: '$cartItem.productId',
            qty: '$cartItem.qty'
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        {
          $project: {
            price: '$productDetails.price',
            qty: '$qty'
          }
        },
        {
          $addFields: {
            total: { $multiply: ['$qty', '$price'] }
          }
        }
      ])
      const subtotal = cartItems.reduce((acc, curr) => {
        acc = acc + curr.total
        return acc
      }, 0)

      if (req.body.couponid === '') {
        const orderDetails = new order({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin
          },
          orderItems: productData,
          subTotal: subtotal,
          totalAmount: subtotal,
          paymentMethod: 'online Payment'
        })
        await orderDetails.save()

        var totals = subtotal
        const total = parseInt(totals)
        const create_payment_json = {
          intent: 'sale',
          payer: {
            payment_method: 'paypal'
          },
          redirect_urls: {
            return_url: 'http://localhost:4000/success',
            cancel_url: 'http://localhost:4000/failed'
          },
          transactions: [{
            item_list: {
              items: [{
                name: 'item',
                sku: 'item',
                price: total,
                currency: 'USD',
                quantity: 1
              }]
            },
            amount: {
              currency: 'USD',
              total
            },
            description: 'This is the payment description.'
          }]
        }
        paypal.payment.create(create_payment_json, async function (error, payment) {
          if (error) {
            throw error
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                res.redirect(payment.links[i].href)
              }
            }
          }
        })
      } else {
        await couponModel.updateOne({ _id: req.body.couponid }, { $push: { users: { userId: req.session.user } } })
        const orderDetails = new order({
          userId: req.session.user,
          name: req.body.name,
          number: req.body.mobile,
          address: {
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            pin: req.body.pin
          },
          orderItems: productData,
          couponUsed: req.body.couponid,
          subTotal: subtotal,
          totalAmount: req.body.total,
          paymentMethod: 'COD'
        })
        await orderDetails.save()

        var totals = subtotal * 0.012
        const total = parseInt(totals)
        const create_payment_json = {
          intent: 'sale',
          payer: {
            payment_method: 'paypal'
          },
          redirect_urls: {
            return_url: 'http://localhost:4000/success',
            cancel_url: 'http://localhost:4000/failed'
          },
          transactions: [{
            item_list: {
              items: [{
                name: 'item',
                sku: 'item',
                price: total,
                currency: 'USD',
                quantity: 1
              }]
            },
            amount: {
              currency: 'USD',
              total
            },
            description: 'This is the payment description.'
          }]
        }
        paypal.payment.create(create_payment_json, async function (error, payment) {
          if (error) {
            throw error
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                res.redirect(payment.links[i].href)
              }
            }
          }
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

paypal.configure({
  mode: 'sandbox', // sandbox or live
  client_id:
    'AcXskD-_4tOiV4Jc9j0_AHbDQSkNbN_kH2zntIQeGdrwI5oSYZvQZWh9EzixiiKaBTWA_zzzLexd-jhv',
  client_secret:
    'EH9yBhfpuT8SPBR4RmcYgoZIgOp8eQwlazFXkedrqzfoIryDRBXmu9smKZFqSZM46VlLOYXLrnZ03Fg4'
})

// const verifyPayment= async (req, res) => {
//   try{
//     const details = req.body;
//     let orderDetails=req.body.orderDetails
//     let hmac = crypto.createHmac("sha256", process.env.KEYSECRET);
//     hmac.update(details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id);
//     hmac = hmac.digest("hex");

//     if (hmac == details.payment.razorpay_signature) {
//       if ( 'couponUsed' in orderDetails){
//         await coupon.updateOne({_id:orderDetails.couponUsed}, { $push: { users: { userId:req.session.user} } })

//       orderDetails=new order(orderDetails)
//         await orderDetails.save()
//       res.json({success:true})
//       }else{
//       let productDetails=orderDetails.orderItems
//         for(let i =0;i<productDetails.length;i++){
//             await product.updateOne({_id:productDetails[i]},{$inc:{stock:-(productDetails.quantity[i])}})
//         }
//         console.log(productDetails);
//         orderDetails=new order(orderDetails)
//         await orderDetails.save()
//         res.json({success:true})
//       }
//     } else {
//       console.log(err);
//       res.json({ failed:true});
//     }
//   }catch(error){
//     console.log(error)
//   }
//   }

const setAddressCheckout = async (req, res) => {
  try {
  //  console.log(req.body.addresId);
    const addresId = req.body.addresId
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
          _id: '$address._id'
        }
      },
      { $match: { _id: new mongoose.Types.ObjectId(addresId) } }
    ])
    // console.log(address);
    res.json({ data: address })
  } catch (error) {
    console.log(error)
  }
}

const success = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.user })
  const brands = await productModel.distinct('brand')
  const categories = await categoryModel.find({ status: true })
  res.render('user/success', { user, brands, categories })
}

const failed = async (req, res) => {
  const user = await userModel.findOne({ _id: req.session.user })
  const brands = await productModel.distinct('brand')
  const categories = await categoryModel.find({ status: true })
  res.render('user/failed', { user, brands, categories })
}

module.exports = {
  userCart,
  addtocart,
  cartDelete,
  productQtyAdd,
  productQtySub,
  userWishlist,
  addWishlist,
  wishDelete,
  checkOut,
  postCheckOut,
  setAddressCheckout,
  success,
  failed

}
