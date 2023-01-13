const express = require('express')
const router = express.Router()
const upload = require('../middleware/fileUpload')

const admin = require('../Controllers/admin/admin')
const user = require('../Controllers/admin/user')
const category = require('../Controllers/admin/category')
const product = require('../Controllers/admin/product')
const order = require('../Controllers/admin/order')
const coupon = require('../Controllers/admin/coupon')
const banner = require('../Controllers/admin/banner')

// Admin side
router.get('/login', admin.login)
router.post('/login', admin.adminVerification)
router.get('/home', admin.adminHome)

// User side
router.get('/user', user.management)
router.get('/user/block', user.block)

// Category
router.get('/category', category.management)
router.post('/category', category.add)
router.get('/category/block', category.block)
router.get('/category/edit', category.edit)
router.post('/category/edit', category.postEdit)

// Product
router.get('/product', product.management)
router.post('/product', upload.array('image'), product.add)
router.get('/product/block', product.block)
router.get('/product/edit', product.edit)
router.post('/product/edit', upload.single('image'), product.postEdit)

// Orders
router.get('/order', order.management)
router.post('/order',order.update)

// Coupen
router.get('/coupon',coupon.management)
router.post('/coupon',coupon.add )
router.get('/coupon/block',coupon.block)

// Banner
router.get('/banner',banner.management)
router.post('/banner',upload.array('image'),banner.add)
router.get('/banner/block',banner.block)



module.exports = router
