const express = require('express')
const router = express.Router()
const upload = require('../middleware/fileUpload')

const admin = require('../Controllers/admin/admin')
const session = require('../middleware/adminSession')
const user = require('../Controllers/admin/user')
const category = require('../Controllers/admin/category')
const product = require('../Controllers/admin/product')
const order = require('../Controllers/admin/order')
const coupon = require('../Controllers/admin/coupon')
const banner = require('../Controllers/admin/banner')

// Admin side
router.get('/login', session.isLogout, admin.login)
router.post('/login', session.isLogout, admin.adminVerification)
router.get('/home', session.isLogout, admin.adminHome)

// User side
router.get('/user', session.isLogin, user.management)
router.get('/user/block', session.isLogin, user.block)

// Category
router.get('/category', session.isLogin, category.management)
router.post('/category', session.isLogin, category.add)
router.get('/category/block', session.isLogin, category.block)
router.get('/category/edit', session.isLogin, category.edit)
router.post('/category/edit', category.postEdit)

// Product
router.get('/product', session.isLogin, product.management)
router.post('/product', session.isLogin, upload.array('image'), product.add)
router.get('/product/block', session.isLogin, product.block)
router.get('/product/edit', session.isLogin, product.edit)
router.post('/product/edit', session.isLogin, upload.single('image'), product.postEdit)

// Orders
router.get('/order', session.isLogin, order.management)
router.post('/order', session.isLogin, order.update)

// Coupen
router.get('/coupon', session.isLogin, coupon.management)
router.post('/coupon', session.isLogin, coupon.add)
router.get('/coupon/block', session.isLogin, coupon.block)

// Banner
router.get('/banner', session.isLogin, banner.management)
router.post('/banner', session.isLogin, upload.array('image'), banner.add)
router.get('/banner/block', session.isLogin, banner.block)

module.exports = router
