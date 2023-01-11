const express = require('express')
const router = express.Router()

const session = require('../middleware/userSession')
const signup = require('../Controllers/user/signup')
const login = require('../Controllers/user/login')
const user = require('../Controllers/user/user')
const shop = require('../Controllers/user/shop')
const coupon = require('../Controllers/user/coupon')
const order = require('../Controllers/user/order')


// Signup
router.get('/signup',session.isLogout,signup.signupPage)
router.post('/signup',session.isLogout,signup.registerUser)
// router.get('/otpVerification',session.isLogout, signup.otpPage)
router.post('/otpVerification',session.isLogout, signup.otpVerification)

// Login
router.get('/login',session.isLogout, login.loginPage)
router.post('/login',session.isLogout, login.userVerfication)

// Home
router.get('/', user.home)

// Products
router.get('/products', user.product)
router.get('/products-details', user.productDetails)

// Profile
router.get('/profile',session.isLogin,user.profile)
router.post('/profile-edit',session.isLogin,user.profileEdit)
router.post('/add-address',session.isLogin,user.addressAdd)
router.get('/address-delete',session.isLogin,user.addressDelete)
router.get('/profile/address-edit',session.isLogin,user.addressEdit)
router.post('/profile/address-post',session.isLogin,user.addressPost)
router.get('/profile/address-default',session.isLogin,user.addressDefault)
router.post('/setaddress',session.isLogin,shop.setAddressCheckout)

// Cart
router.get('/cart',session.isLogin,shop.userCart)
// router.get('/addtocart',session.isLogin,shop.addToCart)
router.post('/add_to_cart',session.isLogin,shop.add_to_cart)
router.patch('/productadd',session.isLogin,shop.productQtyAdd)
router.patch('/productsub',session.isLogin,shop.productQtySub)
router.get('/cart-item-delete',session.isLogin,shop.cartDelete)

// Wishlist
router.get('/wishlist',session.isLogin,shop.userWishlist)
router.post('/addtowish',session.isLogin,shop.addWishlist)
router.get('/wish-item-delete',session.isLogin,shop.wishDelete)


// Checkout
router.get('/checkout',session.isLogin,shop.checkOut)
router.post('/checkout',session.isLogin,shop.postCheckOut)


// Coupon
router.post('/coupon_check',session.isLogin,coupon.couponCheck)

// Order
router.get('/order',session.isLogin,order.orderPage)
router.get('/order/cancel_orders',session.isLogin,order.orderCancel)
router.get('/order/view_orders',session.isLogin,order.orderDetails)




module.exports = router
