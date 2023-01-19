const express = require('express')
const router = express.Router()
const upload = require('../middleware/fileUpload')

const admin = require('../Controllers/admin/admin')
const adminSession = require('../middleware/adminSession')
const user = require('../Controllers/admin/user')
const category = require('../Controllers/admin/category')
const product = require('../Controllers/admin/product')
const order = require('../Controllers/admin/order')
const coupon = require('../Controllers/admin/coupon')
const banner = require('../Controllers/admin/banner')
const sales = require('../Controllers/admin/sales')

// Admin side
router.get('/login', adminSession.isLogout, admin.login)
router.post('/login', adminSession.isLogout, admin.adminVerification)
router.get('/home', adminSession.isLogin, admin.adminHome)

// logout
router.get('/logout', adminSession.isLogin, admin.logout)

// User side
router.get('/user', adminSession.isLogin, user.management)
router.get('/user/block', adminSession.isLogin, user.block)

// Category
router.get('/category', adminSession.isLogin, category.management)
router.post('/category', adminSession.isLogin, category.add)
router.get('/category/block', adminSession.isLogin, category.block)
router.get('/category/edit', adminSession.isLogin, category.edit)
router.post('/category/edit', adminSession.isLogin, category.postEdit)

// Product
router.get('/product', adminSession.isLogin, product.management)
router.post('/product', adminSession.isLogin, upload.array('image'), product.add)
router.get('/product/block', adminSession.isLogin, product.block)
router.get('/product/edit', adminSession.isLogin, product.edit)
router.post('/product/edit', adminSession.isLogin, upload.single('image'), product.postEdit)

// Orders
router.get('/order', adminSession.isLogin, order.management)
router.post('/order', adminSession.isLogin, order.update)
router.get('/view', adminSession.isLogin, order.viewOrder)

// Coupon
router.get('/coupon', adminSession.isLogin, coupon.management)
router.post('/coupon', adminSession.isLogin, coupon.add)
router.get('/coupon/block', adminSession.isLogin, coupon.block)

// Banner
router.get('/banner', adminSession.isLogin, banner.management)
router.post('/banner', adminSession.isLogin, upload.array('image'), banner.add)
router.get('/banner/block', adminSession.isLogin, banner.block)

// Sales
router.get('/sales', adminSession.isLogin, sales.salesPage)
router.post('/sales', adminSession.isLogin, sales.postPDFData)
router.get('/csv_download', adminSession.isLogin, sales.csvDownload)

module.exports = router
